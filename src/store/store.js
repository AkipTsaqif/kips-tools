import { create } from "zustand";

export const useMapCoordsStore = create((set) => ({
    mapCoords: { lat: 0, lng: 0 },
    mapBounds: [0, 0, 0, 0],
    departureCoords: { lat: 0, lng: 0 },
    destinationCoords: { lat: 0, lng: 0 },
    setMapCoords: (lat, lng) => set({ mapCoords: { lat, lng } }),
    setMapBounds: (bounds) => set({ mapBounds: bounds }),
    setDepartureCoords: (lat, lng) => set({ departureCoords: { lat, lng } }),
    setDestinationCoords: (lat, lng) =>
        set({ destinationCoords: { lat, lng } }),
}));
