import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Tooltip,
    useMap,
    Polyline,
} from "react-leaflet";
import { useMapCoordsStore } from "@/store/store";
import { MapPin } from "lucide-react";
import ReactDOMServer from "react-dom/server";
import L from "leaflet";
import { splitString } from "@/lib/helpers";
import "leaflet/dist/leaflet.css";
import "leaflet-contextmenu";
// import "leaflet-contextmenu/dist/leaflet.contextmenu.css";

const pinIcon = new L.divIcon({
    className: "pin-icon",
    html: ReactDOMServer.renderToString(
        <MapPin
            color="#0C1B2A"
            fill="#F9D437"
            strokeWidth={3}
            className="w-6 h-6"
        />
    ),
    iconAnchor: [12, 24],
});

const LayoutListener = ({ isMenuOpen }) => {
    const map = useMap();
    useEffect(() => {
        const currentCenter = map?.getCenter();
        const bounds = map?.getBounds();
        console.log(bounds.getNorthEast());
        console.log(bounds.getNorthWest());
        let newNorthEast = [
            bounds.getNorthEast().lat,
            bounds.getSouthWest().lng +
                (2 * (bounds.getNorthEast().lng - bounds.getSouthWest().lng)) /
                    3,
        ];
        let newSouthEast = [
            bounds.getSouthWest().lat,
            bounds.getSouthWest().lng +
                (2 * (bounds.getNorthEast().lng - bounds.getSouthWest().lng)) /
                    3,
        ];
        const newCenter = [
            (newNorthEast[0] + bounds.getSouthWest().lat) / 2,
            (newNorthEast[1] + bounds.getSouthWest().lng) / 2,
        ];
        console.log(bounds);
        console.log(newNorthEast);
        console.log(newNorthEast[0]);
        console.log(bounds.getSouthWest().lat);
        console.log(newCenter);

        map?.invalidateSize();
        map?.setView(newCenter);
    }, [map, isMenuOpen]);
    return null;
};

const Map = ({ contextMenus, waypoints, isMenuOpen }) => {
    const [isDepartureSet, setIsDepartureSet] = useState(false);
    const [isDestinationSet, setIsDestinationSet] = useState(false);
    const [map, setMap] = useState(null);

    const coords = useMapCoordsStore(
        useShallow((state) => ({
            mapCoords: state.mapCoords,
            mapBounds: state.mapBounds,
            departureCoords: state.departureCoords,
            departureAddress: state.departureAddress,
            destinationCoords: state.destinationCoords,
            destinationAddress: state.destinationAddress,
        }))
    );

    const deptAddress = splitString(coords.departureAddress, ",", 4);
    const destAddress = splitString(coords.destinationAddress, ",", 4);

    useEffect(() => {
        if (!isMenuOpen) {
            map?.invalidateSize();
        }
    }, [isMenuOpen, map]);

    useEffect(() => {
        console.log(coords.mapBounds);

        if (map && coords.mapBounds[0] !== 0) {
            map.invalidateSize();
            map.fitBounds([
                [coords.mapBounds[1], coords.mapBounds[0]],
                [coords.mapBounds[3], coords.mapBounds[2]],
            ]);
        }
    }, [coords.mapBounds]);

    useEffect(() => {
        const unsubscribeDepartureCoords = useMapCoordsStore.subscribe(
            (state, previousState) => {
                if (state.departureCoords !== previousState.departureCoords) {
                    if (
                        state.departureCoords[0] !== 0 ||
                        state.departureCoords[1] !== 0
                    ) {
                        setIsDepartureSet(true);
                    } else {
                        setIsDepartureSet(false);
                    }
                }
            },
            (state) => [state.destinationCoords]
        );

        const unsubscribeDestinationCoords = useMapCoordsStore.subscribe(
            (state, previousState) => {
                if (
                    state.destinationCoords !== previousState.destinationCoords
                ) {
                    if (
                        state.destinationCoords[0] !== 0 ||
                        state.destinationCoords[1] !== 0
                    ) {
                        setIsDestinationSet(true);
                    } else {
                        setIsDestinationSet(false);
                    }
                }
            },
            (state) => [state.destinationCoords]
        );

        return () => {
            unsubscribeDestinationCoords();
            unsubscribeDepartureCoords();
        };
    }, []);

    return (
        <div className="h-full w-full">
            <MapContainer
                ref={setMap}
                center={[-6.2139, 106.8505]}
                zoom={12}
                contextmenu={true}
                contextmenuWidth={140}
                contextmenuItems={contextMenus}
            >
                {/* <LayoutListener isMenuOpen={isMenuOpen} /> */}
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {isDestinationSet && (
                    <Marker
                        position={[
                            parseFloat(coords.destinationCoords.lat),
                            parseFloat(coords.destinationCoords.lng),
                        ]}
                        icon={pinIcon}
                    >
                        <Tooltip permanent direction="right">
                            <p className="w-[300px] break-normal">
                                {destAddress}
                            </p>
                        </Tooltip>
                    </Marker>
                )}
                {isDepartureSet && (
                    <Marker
                        position={[
                            parseFloat(coords.departureCoords.lat),
                            parseFloat(coords.departureCoords.lng),
                        ]}
                        icon={pinIcon}
                    >
                        <Tooltip permanent direction="right">
                            <p className="w-[300px] break-normal">
                                {deptAddress}
                            </p>
                        </Tooltip>
                    </Marker>
                )}
                {waypoints.length > 0 && (
                    <Polyline
                        pathOptions={{ color: "#0C1B2A" }}
                        positions={waypoints}
                    />
                )}
            </MapContainer>
        </div>
    );
};

export default Map;
