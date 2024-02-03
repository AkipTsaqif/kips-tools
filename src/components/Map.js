import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
    Polyline,
} from "react-leaflet";
import { useMapCoordsStore } from "@/store/store";
import { MapPin } from "lucide-react";
import ReactDOMServer from "react-dom/server";
import L from "leaflet";
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

const Map = ({ contextMenus, directions }) => {
    const [isDepartureSet, setIsDepartureSet] = useState(false);
    const [isDestinationSet, setIsDestinationSet] = useState(false);
    const [map, setMap] = useState(null);

    const coords = useMapCoordsStore(
        useShallow((state) => ({
            mapCoords: state.mapCoords,
            mapBounds: state.mapBounds,
            departureCoords: state.departureCoords,
            destinationCoords: state.destinationCoords,
        }))
    );

    useEffect(() => {
        console.log(coords.mapBounds);

        if (map && coords.mapBounds[0] !== 0) {
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
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {isDestinationSet && (
                    <Marker
                        position={[
                            parseFloat(coords.destinationCoords.lat),
                            parseFloat(coords.destinationCoords.lng),
                        ]}
                        icon={pinIcon}
                    />
                )}
                {isDepartureSet && (
                    <Marker
                        position={[
                            parseFloat(coords.departureCoords.lat),
                            parseFloat(coords.departureCoords.lng),
                        ]}
                        icon={pinIcon}
                    />
                )}
                {directions.length > 0 && (
                    <Polyline
                        pathOptions={{ color: "#0C1B2A" }}
                        positions={directions}
                    />
                )}
            </MapContainer>
        </div>
    );
};

export default Map;
