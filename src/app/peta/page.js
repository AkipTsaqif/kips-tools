"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Map from "@/components/Map";
import { Input } from "@/components/ui/input";

const Maps = dynamic(() => import("@/components/Map"), {
    ssr: false,
});

export default function MainMap() {
    const [isFindingDirection, setIsFindingDirection] = useState(false);
    const [departurePoint, setDeparturePoint] = useState(null);
    const [destinationPoint, setDestinationPoint] = useState(null);

    const contextMenus = [
        {
            text: "Rute dari sini",
            callback: (e) => {
                console.log(e.latlng);
                setDeparturePoint(e.latlng);
                setIsFindingDirection(true);
            },
        },
        {
            text: "Rute ke sini",
            callback: (e) => {
                console.log(e.latlng);
                setDestinationPoint(e.latlng);
                setIsFindingDirection(true);
            },
        },
    ];

    return (
        <div className="w-screen h-[calc(100vh-52px)] relative">
            {isFindingDirection && (
                <div className="absolute right-0 top-0 z-[500] w-1/3">
                    <div className="mt-4 mr-4 bg-white">
                        <div className="p-2 flex flex-col gap-2">
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
                        </div>
                    </div>
                </div>
            )}
            <Maps contextMenus={contextMenus} />
        </div>
    );
}
