"use client";

import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Polyline, MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { TraccarPosition } from '@repo/shared-types';

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
  const mapRef = useRef<L.Map | null>(null);
  const driverMarkersRef = useRef<{ [key: number]: L.Marker }>({});
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [driverPaths, setDriverPaths] = useState<{ [key: number]: [number, number][] }>({});

  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    // Initialize Map centered on Lokoja
    const map = L.map(mapContainerRef.current!).setView([7.800, 6.736], 13);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

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

      const positions: TraccarPosition[] = await res.json();

      const newPaths = { ...driverPaths };

      positions.forEach(pos => {
        const newLatLng = new L.LatLng(pos.latitude, pos.longitude);
        if (driverMarkersRef.current[pos.deviceId]) {
          driverMarkersRef.current[pos.deviceId].setLatLng(newLatLng);
        } else {
          const newMarker = L.marker(newLatLng, { icon: driverIcon }).addTo(mapRef.current!);
          newMarker.bindPopup(`Device: ${pos.deviceId}`);
          driverMarkersRef.current[pos.deviceId] = newMarker;
        }

        if (!newPaths[pos.deviceId]) {
          newPaths[pos.deviceId] = [];
        }
        newPaths[pos.deviceId].push([pos.latitude, pos.longitude]);
      });

      setDriverPaths(newPaths);

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

  return (
    <div ref={mapContainerRef} style={{ height: '600px', width: '100%' }} >
      <MapContainer center={[7.800, 6.736]} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {Object.values(driverPaths).map((path, index) => (
          <Polyline key={index} positions={path} color="blue" />
        ))}
      </MapContainer>
    </div>
  );
}