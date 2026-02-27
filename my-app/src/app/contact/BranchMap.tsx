"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import L from "leaflet";
import { branches } from "./branches";

const CENTER: [number, number] = [43.240, 76.930];

export default function BranchMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Already initialised (Strict Mode double-invoke guard)
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = L.map(containerRef.current).setView(CENTER, 12);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const icon = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    branches.forEach((b) => {
      L.marker([b.lat, b.lng], { icon })
        .addTo(map)
        .bindPopup(`
          <strong style="font-size:13px;font-family:Poppins,sans-serif">${b.name}</strong><br/>
          <span style="font-size:12px;color:#555;font-family:Poppins,sans-serif">${b.address}</span><br/>
          <a href="tel:${b.phone.replace(/\s/g, "")}" style="font-size:12px;color:#1a5319;font-family:Poppins,sans-serif">${b.phone}</a>
        `);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}