import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-contextmenu";
// import "leaflet-contextmenu/dist/leaflet.contextmenu.css";

const Map = ({ contextMenus }) => {
    return (
        <div className="h-full w-full">
            <MapContainer
                center={[-6.2139, 106.8505]}
                zoom={12}
                contextmenu={true}
                contextmenuWidth={140}
                contextmenuItems={contextMenus}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            </MapContainer>
        </div>
    );
};

export default Map;
