"use client";

import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import dynamic from "next/dynamic";
import Map from "@/components/Map";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { decode } from "@googlemaps/polyline-codec";
import { useMapCoordsStore } from "@/store/store";
import { Button } from "@/components/ui/button";
import { formatSecondstoTime } from "@/lib/helpers";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Maps = dynamic(() => import("@/components/Map"), {
    ssr: false,
});

const frameworks = [
    {
        value: "next.js",
        label: "Next.js",
    },
    {
        value: "sveltekit",
        label: "SvelteKit",
    },
    {
        value: "nuxt.js",
        label: "Nuxt.js",
    },
    {
        value: "remix",
        label: "Remix",
    },
    {
        value: "astro",
        label: "Astro",
    },
];

export default function MainMap() {
    const [isFindingDirection, setIsFindingDirection] = useState(false);
    const [preference, setPreference] = useState("recommended");
    const [directionFound, setDirectionFound] = useState(false);
    const [departurePoint, setDeparturePoint] = useState(null);
    const [departureAddr, setDepartureAddr] = useState("");
    const [destinationPoint, setDestinationPoint] = useState(null);
    const [destinationAddr, setDestinationAddr] = useState("");
    const [waypoints, setWaypoints] = useState([]);
    const [directions, setDirections] = useState([]);
    const [routeStatistics, setRouteStatistics] = useState({
        distance: 0,
        duration: 0,
    });

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");

    const setCoords = useMapCoordsStore();

    const contextMenus = [
        {
            text: "Rute dari sini",
            callback: (e) => {
                console.log(e.latlng);
                setDeparturePoint(e.latlng);
                setCoords.setDepartureCoords(e.latlng.lat, e.latlng.lng);
                setIsFindingDirection(true);
                getAddress(e.latlng, null);
            },
        },
        {
            text: "Rute ke sini",
            callback: (e) => {
                console.log(e.latlng);
                setDestinationPoint(e.latlng);
                setCoords.setDestinationCoords(e.latlng.lat, e.latlng.lng);
                setIsFindingDirection(true);
                getAddress(null, e.latlng);
            },
        },
    ];

    const getAddress = async (dept, dest) => {
        if (dept)
            await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${dept.lat}&lon=${dept.lng}&format=json&accept-language=id`
            )
                .then((resp) => resp.json())
                .then((data) => {
                    console.log(data);
                    setDepartureAddr(data.display_name);
                    setCoords.setDepartureAddress(data.display_name);
                });
        if (dest)
            await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${dest.lat}&lon=${dest.lng}&format=json&accept-language=id`
            )
                .then((resp) => resp.json())
                .then((data) => {
                    console.log(data);
                    setDestinationAddr(data.display_name);
                    setCoords.setDestinationAddress(data.display_name);
                });
    };

    const getDirection = async () => {
        const test = `https://nominatim.openstreetmap.org/reverse?`;
        console.log(departurePoint, destinationPoint);
        await fetch("http://localhost:3000/api/routing", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                departure: departurePoint,
                destination: destinationPoint,
                preference,
            }),
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log(data);
                if (data.status === 200) {
                    setCoords.setMapBounds(data.result.bbox);
                    setDirectionFound(true);
                    setWaypoints(decode(data.result.routes[0].geometry));
                    setDirections(data.result.routes[0].segments[0].steps);
                    setRouteStatistics(data.result.routes[0].summary);
                }
            });
        // setIsFindingDirection(false);
    };

    useEffect(() => {
        if (departurePoint && destinationPoint) {
            getDirection();
        }
    }, [departurePoint, destinationPoint, preference]);

    return (
        <div className="w-screen h-[calc(100vh-52px)] relative">
            <Button
                className="absolute right-0 top-1/2 z-[501] bg-white p-0 rounded-r-none hover:bg-neutral-200 drop-shadow-xl px-1"
                onClick={() => setIsFindingDirection(!isFindingDirection)}
            >
                {isFindingDirection ? (
                    <ChevronRight size={24} strokeWidth={2.5} color="black" />
                ) : (
                    <ChevronLeft size={24} strokeWidth={2.5} color="black" />
                )}
            </Button>
            {isFindingDirection && (
                <div className="absolute right-0 top-0 z-[500] w-1/3">
                    <div className="bg-white">
                        <div className="p-4 flex flex-col gap-2">
                            <div className="w-full flex flex-col mb-2">
                                <span className="text-xs">Preferensi Rute</span>
                                <Select
                                    onValueChange={(e) => setPreference(e)}
                                    defaultValue={preference}
                                >
                                    <SelectTrigger className="w-full focus:ring-0">
                                        <SelectValue placeholder="Pilih preferensi rute" />
                                    </SelectTrigger>
                                    <SelectContent className="z-[501] focus:ring-0">
                                        <SelectGroup>
                                            <SelectItem value="recommended">
                                                Rekomendasi
                                            </SelectItem>
                                            <SelectItem value="fastest">
                                                Tercepat
                                            </SelectItem>
                                            <SelectItem value="shortest">
                                                Terpendek
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs">Dari</span>
                                <div className="flex gap-2">
                                    <Input
                                        className="w-2/5"
                                        value={
                                            departurePoint &&
                                            `${departurePoint.lat.toFixed(
                                                4
                                            )}, ${departurePoint.lng.toFixed(
                                                4
                                            )}`
                                        }
                                        placeholder="Titik awal"
                                    />
                                    <Input
                                        className="w-3/5"
                                        value={departureAddr}
                                        placeholder="Alamat"
                                    />
                                </div>
                            </div>
                            <div>
                                <span className="text-xs">Ke</span>
                                <div className="flex gap-2">
                                    <Input
                                        className="w-2/5"
                                        value={
                                            destinationPoint &&
                                            `${destinationPoint.lat.toFixed(
                                                4
                                            )}, ${destinationPoint.lng.toFixed(
                                                4
                                            )}`
                                        }
                                        placeholder="Titik tujuan"
                                    />
                                    <Input
                                        className="w-3/5"
                                        value={destinationAddr}
                                        placeholder="Alamat"
                                    />
                                </div>
                            </div>

                            {/* <Button
                                onClick={getDirection}
                                disabled={!destinationPoint || !departurePoint}
                                className="disabled:bg-neutral-200"
                            >
                                Cari arah
                            </Button> */}
                            <div className="flex flex-col my-4">
                                {directionFound ? (
                                    <div className="flex gap-2 w-full">
                                        <div className="flex justify-between w-full">
                                            <div className="flex flex-col w-1/2">
                                                <p className="text-xs text-neutral-300">
                                                    Jarak
                                                </p>
                                                <span>
                                                    {routeStatistics.distance ===
                                                    0
                                                        ? "-"
                                                        : `${(
                                                              routeStatistics.distance /
                                                              1000
                                                          ).toFixed(1)} km`}
                                                </span>
                                            </div>
                                            <div className="flex flex-col w-1/2">
                                                <p className="text-xs text-neutral-300">
                                                    Waktu Tempuh
                                                </p>
                                                <span>
                                                    {routeStatistics.duration ===
                                                    0
                                                        ? "-"
                                                        : `${formatSecondstoTime(
                                                              routeStatistics.duration
                                                          )}`}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-center text-neutral-300">
                                        Menunggu rute terbentuk
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div
                className={
                    isFindingDirection ? "w-2/3 h-full" : "w-full h-full"
                }
            >
                <Maps
                    contextMenus={contextMenus}
                    waypoints={waypoints}
                    isMenuOpen={isFindingDirection}
                />
            </div>
        </div>
    );
}
