"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    DG: any;
  }
}

export default function Map2GIS() {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const src = "https://maps.api.2gis.ru/2.0/loader.js?pkg=full";

    const loadScript = () =>
      new Promise<void>((resolve, reject) => {
        if (window.DG?.map) return resolve();

        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing) return resolve();

        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("2GIS script load failed"));
        document.body.appendChild(script);
      });

    const waitForDG = () =>
      new Promise<void>((resolve) => {
        const check = () => {
          if (window.DG?.map) resolve();
          else setTimeout(check, 50);
        };
        check();
      });

    (async () => {
      await loadScript();
      await waitForDG();

      const map = window.DG.map(mapRef.current, {
        center: [43.238949, 76.889709],
        zoom: 13,
      });

      window.DG.marker([43.238949, 76.889709]).addTo(map);
    })().catch(console.error);
  }, []);

  return <div ref={mapRef} style={{ width: "100%", height: 420 }} />;
}