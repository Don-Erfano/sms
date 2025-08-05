'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { LocationData } from '@/components/processor/data-processor';

const MapWithPins = dynamic(() => import('./MapWithPin'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full w-full bg-gray-100 rounded-15">
      <p>Loading map...</p>
    </div>
  ),
});

interface MapWrapperProps {
  data: LocationData[];
  selectedCategory?: string;
  onPinClick?: (location: LocationData) => void;
}

const MapWrapper: React.FC<MapWrapperProps> = (props) => {
  return <MapWithPins {...props} />;
};

export default MapWrapper;
