"use client";

import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import dynamic from "next/dynamic";
import Map from "@/components/Map";
import { Input } from "@/components/ui/input";
import { decode } from "@googlemaps/polyline-codec";
import { useMapCoordsStore } from "@/store/store";
import { Button } from "@/components/ui/button";

const Maps = dynamic(() => import("@/components/Map"), {
    ssr: false,
});

export default function MainMap() {
    const [isFindingDirection, setIsFindingDirection] = useState(false);
    const [departurePoint, setDeparturePoint] = useState(null);
    const [destinationPoint, setDestinationPoint] = useState(null);
    const [directions, setDirections] = useState([]);

    const setCoords = useMapCoordsStore();

    const contextMenus = [
        {
            text: "Rute dari sini",
            callback: (e) => {
                console.log(e.latlng);
                setDeparturePoint(e.latlng);
                setCoords.setDepartureCoords(e.latlng.lat, e.latlng.lng);
                setIsFindingDirection(true);
            },
        },
        {
            text: "Rute ke sini",
            callback: (e) => {
                console.log(e.latlng);
                setDestinationPoint(e.latlng);
                setCoords.setDestinationCoords(e.latlng.lat, e.latlng.lng);
                setIsFindingDirection(true);
            },
        },
    ];

    const getDirection = async () => {
        console.log(departurePoint, destinationPoint);
        await fetch("http://localhost:3000/api/routing", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                departure: departurePoint,
                destination: destinationPoint,
            }),
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log(data);
                if (data.status === 200) {
                    setCoords.setMapBounds(data.result.bbox);
                    setDirections(decode(data.result.routes[0].geometry));
                }
            });
        setIsFindingDirection(false);
    };

    return (
        <div className="w-screen h-[calc(100vh-52px)] relative">
            {isFindingDirection && (
                <div className="absolute right-0 top-0 z-[500] w-1/3">
                    <div className="mt-4 mr-4 bg-white">
                        <div className="p-4 flex flex-col gap-2">
                            <Input
                                value={
                                    departurePoint &&
                                    `${departurePoint.lat.toFixed(
                                        5
                                    )}, ${departurePoint.lng.toFixed(5)}`
                                }
                                placeholder="Titik awal"
                            />
                            <Input
                                value={
                                    destinationPoint &&
                                    `${destinationPoint.lat.toFixed(
                                        5
                                    )}, ${destinationPoint.lng.toFixed(5)}`
                                }
                                placeholder="Titik tujuan"
                            />
                            <Button
                                onClick={getDirection}
                                disabled={!destinationPoint || !departurePoint}
                                className="disabled:bg-neutral-200"
                            >
                                Cari arah
                            </Button>
                            <div className="flex flex-col my-4">
                                <p className="text-sm text-center text-neutral-300">
                                    Menunggu rute terbentuk
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Maps contextMenus={contextMenus} directions={directions} />
        </div>
    );
}
