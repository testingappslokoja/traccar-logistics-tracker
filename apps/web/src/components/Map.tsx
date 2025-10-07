"use client";

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet icon not appearing
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const driverIcon = L.icon({
  iconUrl: 'https://uxwing.com/wp-content/themes/uxwing/download/transportation-automotive/delivery-bike-icon.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

interface MapProps {
  deviceIds: number[];
}

export default function Map({ deviceIds }: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const driverMarkersRef = useRef<{ [key: number]: L.Marker }>({});
  const driverPathsRef = useRef<{ [key: number]: L.Polyline }>({});

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const map = L.map(mapContainerRef.current).setView([7.800, 6.736], 13);
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
    }

    const locationInterval = setInterval(async () => {
      const res = await fetch('/api/get-location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceIds }),
      });

      if (!res.ok) {
        console.error('Error fetching driver locations:', await res.text());
        return;
      }

      const positions: any[] = await res.json();

      positions.forEach(pos => {
        const newLatLng = new L.LatLng(pos.latitude, pos.longitude);

        if (driverMarkersRef.current[pos.deviceId]) {
          driverMarkersRef.current[pos.deviceId].setLatLng(newLatLng);
        } else if (mapRef.current) {
          const newMarker = L.marker(newLatLng, { icon: driverIcon }).addTo(mapRef.current);
          newMarker.bindPopup(`Device: ${pos.deviceId}`);
          driverMarkersRef.current[pos.deviceId] = newMarker;
        }

        if (mapRef.current) {
          if (!driverPathsRef.current[pos.deviceId]) {
            driverPathsRef.current[pos.deviceId] = L.polyline([], { color: 'blue' }).addTo(mapRef.current);
          }
          driverPathsRef.current[pos.deviceId].addLatLng(newLatLng);
        }
      });

      if (mapRef.current && positions.length > 0) {
        const bounds = L.latLngBounds(positions.map(p => [p.latitude, p.longitude]));
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }, 1000);

    return () => {
      clearInterval(locationInterval);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [deviceIds]);

  return <div ref={mapContainerRef} style={{ height: '600px', width: '100%' }} />;
}