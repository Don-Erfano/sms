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
  categoryHierarchy,
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
    let valueToShow = 0;
    let color = '#D01739';

    if (selectedCategory) {
      valueToShow = location.categories[selectedCategory] || 0;
      color = categoryConfig[selectedCategory]?.color || '#D01739';
    } else {
      let topMainCategory = '';
      let topCount = 0;

      Object.keys(categoryHierarchy).forEach((mainCat) => {
        const count = location.categories[mainCat] || 0;
        if (count > topCount) {
          topCount = count;
          topMainCategory = mainCat;
        }
      });

      valueToShow = Object.values(location.categories).reduce(
        (sum, val) => sum + val,
        0,
      );
      if (topMainCategory) {
        color = categoryHierarchy[topMainCategory]?.color || '#D01739';
      }
    }

    size = Math.min(Math.max(valueToShow * 3 + 12, 12), 30);

    return L.divIcon({
      html: `<div style="background:${color};
        border:2px solid white;
        border-radius:50%;
        width:${size}px;
        height:${size}px;
        box-shadow:0 2px 4px rgba(0,0,0,0.3);
        display:flex;
        align-items:center;
        justify-content:center;
        color:white;
        font-weight:bold;
        font-size:10px;">
        ${valueToShow}
      </div>`,
      className: '',
      iconSize: [size, size],
    });
  };

  return (
    <MapContainer
      center={[32.4279, 53.688]}
      zoom={6}
      style={{ height: '100%', width: '100%', borderRadius: '8px' }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup>
        {filteredData.map((location) => {
          const mainCategoryNames = Object.entries(categoryHierarchy)
            .filter(([mainCat]) => location.categories[mainCat] > 0)
            .map(([mainCat]) => mainCat);

          return (
            <Marker
              key={location.id}
              position={[location.lat, location.lng]}
              icon={createCustomIcon(location)}
              eventHandlers={{ click: () => onPinClick?.(location) }}
            >
              <Popup maxWidth={300}>
                <div className="p-2 min-w-48">
                  {mainCategoryNames.length > 0 && (
                    <p className="text-sm mb-2 text-start font-semibold">
                      کل پیام‌ها :{' '}
                      {location.categories[mainCategoryNames[0]] || 0}
                    </p>
                  )}

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

                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {mainCategoryNames.map((mainCat) => (
                      <div key={mainCat}>
                        <div className="font-bold text-sm text-start mb-1">
                          دسته بندی: {mainCat}{' '}
                          {location.categories[mainCat] || 0}
                        </div>

                        {categoryHierarchy[mainCat].subcategories
                          .filter((sub) => location.categories[sub] > 0)
                          .map((sub) => (
                            <div
                              key={sub}
                              className="flex justify-between text-xs"
                            >
                              <span className="flex-1 text-right">{sub}</span>
                              <span className="font-semibold ml-2">
                                {location.categories[sub]}
                              </span>
                            </div>
                          ))}
                      </div>
                    ))}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default MapWithPins;
