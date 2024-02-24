import { create } from "zustand";

export const useMapCoordsStore = create((set) => ({
    mapCoords: { lat: 0, lng: 0 },
    mapBounds: [0, 0, 0, 0],
    departureCoords: { lat: 0, lng: 0 },
    departureAddress: "",
    destinationCoords: { lat: 0, lng: 0 },
    destinationAddress: "",
    setMapCoords: (lat, lng) => set({ mapCoords: { lat, lng } }),
    setMapBounds: (bounds) => set({ mapBounds: bounds }),
    setDepartureCoords: (lat, lng) => set({ departureCoords: { lat, lng } }),
    setDestinationCoords: (lat, lng) =>
        set({ destinationCoords: { lat, lng } }),
    setDepartureAddress: (address) => set({ departureAddress: address }),
    setDestinationAddress: (address) => set({ destinationAddress: address }),
}));
