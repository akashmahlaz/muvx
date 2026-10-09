import { useEffect, useRef } from 'react';
import { Map, NavigationControl, Marker, setWorkerUrl } from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import 'maplibre-gl/dist/maplibre-gl.css';

// Fix Vite worker issue for MapLibre
setWorkerUrl(workerUrl);

function calculateBearing(from: [number, number], to: [number, number]) {
  const [lon1, lat1] = from.map((v) => (v * Math.PI) / 180) as [number, number];
  const [lon2, lat2] = to.map((v) => (v * Math.PI) / 180) as [number, number];

  const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);

  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

interface LiveMapProps {
  interactive?: boolean;
  zoomControl?: boolean;
}

export default function LiveMap({ interactive = true, zoomControl = true }: LiveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new Map({
      container: mapContainer.current,
      style: "https://tiles.openfreemap.org/styles/liberty", // Public commercial-friendly no-key style
      center: [-92.21, 37.32], // Center between Chicago and Dallas
      zoom: 4.2,
      interactive: interactive,
      dragPan: interactive,
      scrollZoom: interactive,
      doubleClickZoom: interactive,
    });

    if (zoomControl && interactive) {
      map.addControl(new NavigationControl(), 'top-right');
    }

    mapRef.current = map;

    map.on('error', (e) => {
      console.error('MapLibre error:', e);
    });

    map.on('load', () => {
      
      // Add the route line
      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [
              [-87.6298, 41.8781], // Chicago
              [-90.0, 39.5],
              [-92.5, 37.0], // Midpoint where truck is
              [-94.5, 35.0],
              [-96.7970, 32.7767] // Dallas
            ]
          }
        }
      });

      map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#d9622b',
          'line-width': 4,
          'line-dasharray': [2, 2],
          'line-opacity': 0.8
        }
      });

      // Helper for custom City Markers
      const createDot = (label: string) => {
        const el = document.createElement('div');
        el.className = 'custom-dot relative flex items-center justify-center';
        el.innerHTML = `
          <div style="width: 12px; height: 12px; background: #2a2d35; border: 2px solid #5a5f6d; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.5);"></div>
          <div style="position: absolute; top: -22px; font-weight: 600; font-size: 10px; color: #a0a5b1; white-space: nowrap;">${label}</div>
        `;
        return el;
      };

      new Marker({ element: createDot("Chicago, IL") }).setLngLat([-87.6298, 41.8781]).addTo(map);
      new Marker({ element: createDot("Dallas, TX") }).setLngLat([-96.7970, 32.7767]).addTo(map);

      // Custom Truck Marker
      // Calculate dynamic bearing based on actual route path
      const currentPos: [number, number] = [-92.5, 37.0];
      const nextPos: [number, number] = [-94.5, 35.0];
      const bearing = calculateBearing(currentPos, nextPos);
      
      const truckEl = document.createElement("div");
      truckEl.className = "flex flex-col items-center justify-center relative";
      truckEl.innerHTML = `
        <div class="absolute -top-11 whitespace-nowrap rounded-full bg-[#16181d] border border-gray-700 px-3 py-1.5 text-[10px] text-white font-bold tracking-wider shadow-lg flex items-center gap-2 z-20">
          <div class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          TRK-1043
        </div>
        <div class="relative truck-image-container" style="transform: rotate(${bearing + 90}deg); transition: transform 0.3s ease;">
          <div class="absolute inset-0 bg-[#d9622b] rounded-full blur-md opacity-40 animate-pulse"></div>
          <img
            src="/icons/truck-marker.svg"
            alt="Truck"
            style="width: 36px; height: 36px; display: block; filter: drop-shadow(0px 4px 6px rgba(0,0,0,0.5)); position: relative; z-index: 10;"
          />
        </div>
      `;

      new Marker({
        element: truckEl,
        rotationAlignment: "map",
      })
      .setLngLat(currentPos)
      .addTo(map);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [interactive, zoomControl]);

  return (
    <div className="w-full h-full min-h-[350px] relative rounded overflow-hidden bg-[#1a1c23]">
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />

      {/* Enterprise LIVE Overlay */}
      <div className="absolute top-4 left-4 z-10 bg-[#16181d]/90 backdrop-blur-md border border-gray-800 rounded-lg p-2.5 flex items-center gap-3 shadow-xl">
        <div className="relative flex items-center justify-center">
          <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
          <div className="absolute w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></div>
        </div>
        <div className="flex flex-col">
          <span className="text-white text-[10px] font-bold tracking-widest uppercase leading-none">Live GPS Network</span>
          <span className="text-gray-400 text-[9px] font-medium mt-0.5 leading-none">Updating in real-time</span>
        </div>
      </div>
    </div>
  );
}
