'use client';
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Image from 'next/image';
import {
  LocationData,
  categoryConfig,
} from '@/components/processor/data-processor';

interface MapWithPinsProps {
  data: LocationData[];
  selectedCategory?: string;
  onPinClick?: (location: LocationData) => void;
}

const MapWithPins: React.FC<MapWithPinsProps> = ({
  data,
  selectedCategory,
  onPinClick,
}) => {
  const filteredData = selectedCategory
    ? data.filter((location) => location.categories[selectedCategory] > 0)
    : data;

  const createCustomIcon = (location: LocationData) => {
    let size = 16;
    let color = '#D01739';

    if (selectedCategory && location.categories[selectedCategory]) {
      const count = location.categories[selectedCategory];
      size = Math.min(Math.max(count * 3 + 12, 12), 30);
      color = categoryConfig[selectedCategory]?.color || '#D01739';
    } else if (!selectedCategory) {
      size = Math.min(Math.max(location.totalCount * 2 + 12, 12), 30);
    }

    return L.divIcon({
      html: `<div style="background:${color};border:2px solid white;border-radius:50%;width:${size}px;height:${size}px;box-shadow:0 2px 4px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:10px;">${
        selectedCategory
          ? location.categories[selectedCategory] || 0
          : location.totalCount
      }</div>`,
      className: '',
      iconSize: [size, size],
    });
  };

  return (
    <MapContainer
      center={[32.4279, 53.688]}
      zoom={6}
      style={{
        height: '100%',
        width: '100%',
        borderRadius: '15px',
      }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup>
        {filteredData.map((location) => (
          <Marker
            key={location.id}
            position={[location.lat, location.lng]}
            icon={createCustomIcon(location)}
            eventHandlers={{
              click: () => onPinClick?.(location),
            }}
          >
            <Popup maxWidth={300}>
              <div className="p-2 min-w-48">
                <p className="text-sm mb-2 text-start font-semibold">
                  کل پیام ها : {location.totalCount}
                </p>
                {location.image && (
                  <div className="mb-3">
                    <Image
                      src={location.image}
                      alt="SMS Content"
                      width={200}
                      height={150}
                      className="rounded-lg object-cover w-full"
                      unoptimized
                    />
                  </div>
                )}

                <div className="space-y-1 max-h-32 overflow-y-auto">
                  <h4 className="text-sm font-semibold text-start">
                    دسته بندی:
                  </h4>
                  {Object.entries(location.categories)
                    .filter(([_, count]) => count > 0)
                    .map(([category, count]) => (
                      <div
                        key={category}
                        className="flex justify-between text-xs"
                      >
                        <span className="flex-1 text-right">{category}:</span>
                        <span className="font-semibold ml-2">{count}</span>
                      </div>
                    ))}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default MapWithPins;
