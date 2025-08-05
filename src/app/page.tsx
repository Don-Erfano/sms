'use client';
import React, { useState, useEffect } from 'react';
import CategoryFilter from '@/components/processor/CategoryFilter';
import {
  processLocationData,
  getCategoryStats,
  getProvinceData,
  LocationData,
  CategoryData,
} from '@/components/processor/data-processor';
import CategoryChart from '@/components/processor/CategoryChart';
import Image from 'next/image';
import MapWrapper from '@/components/processor/MapWrapperProps';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined,
  );
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    null,
  );
  const [locationData, setLocationData] = useState<LocationData[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const processedData = processLocationData();

      const stats = getCategoryStats(processedData);

      const provData = getProvinceData(processedData);

      setLocationData(processedData);
      setCategoryStats(stats);
    } catch (error) {
      console.error('Error processing data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePinClick = (location: LocationData) => {
    setSelectedLocation(location);
  };

  const handleCategorySelect = (category?: string) => {
    setSelectedCategory(category);
    setSelectedLocation(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="w-full flex items-center justify-center mb-4">
        <CategoryFilter
          categories={categoryStats}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />
      </div>
      <div className="flex gap-4">
        <div className="w-full">
          <div className="h-155 p-4 bg-white rounded-lg shadow-lg ">
            <MapWrapper
              data={locationData}
              selectedCategory={selectedCategory}
              onPinClick={handlePinClick}
            />
          </div>
        </div>
        <div className="w-full">
          <CategoryChart
            data={
              selectedCategory
                ? locationData.filter((l) => l.categories[selectedCategory] > 0)
                : locationData
            }
            selectedCategory={selectedCategory}
          />
          {selectedLocation && selectedLocation.image && (
            <div className="mt-4 p-4 shadow-xl bg-white rounded-lg">
              <div className="relative w-full h-64">
                <Image
                  src={selectedLocation.image}
                  alt="SMS Content"
                  fill
                  style={{ objectFit: 'contain' }}
                  className="bg-white rounded"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
