'use client';
import React, { useState, useEffect } from 'react';
import { selectedProvinceType } from '@/components/IranMap/interfaces';
import IranMap from '@/components/IranMap/IranMap';
import MapWithPins from '@/components/processor/MapWithPin';
import CategoryFilter from '@/components/processor/CategoryFilter';
import {
  processLocationData,
  getCategoryStats,
  getProvinceData,
  LocationData,
  CategoryData,
} from '@/components/processor/data-processor';
import CategoryChart from '@/components/processor/CategoryChart';

export default function Home() {
  const [selectedProvince, setSelectedProvince] =
    useState<selectedProvinceType | null>(null);
  const [selectedProvinceItem, setSelectedProvinceItem] =
    useState<selectedProvinceType | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined,
  );
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    null,
  );
  const [viewMode, setViewMode] = useState<'province' | 'pins'>('pins');

  const [locationData, setLocationData] = useState<LocationData[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryData[]>([]);
  const [provinceData, setProvinceData] = useState<{ [key: string]: number }>(
    {},
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const processedData = processLocationData();

      const stats = getCategoryStats(processedData);

      const provData = getProvinceData(processedData);

      setLocationData(processedData);
      setCategoryStats(stats);
      setProvinceData(provData);
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          SMS App - Location Analytics
        </h1>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setViewMode('province')}
            className={`px-4 py-2 rounded-lg ${
              viewMode === 'province' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Province View
          </button>
          <button
            onClick={() => setViewMode('pins')}
            className={`px-4 py-2 rounded-lg ${
              viewMode === 'pins' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Pin View ({locationData.length} locations)
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="w-80">
          <CategoryFilter
            categories={categoryStats}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />
        </div>

        <div className="w-full">
          {viewMode === 'province' ? (
            <div className="flex justify-center">
              <IranMap
                data={provinceData}
                dataPercent={{}}
                width={800}
                colorRange="79, 169, 199"
                textColor="#2563eb"
                deactiveProvinceColor="#f3f4f6"
                selectedProvinceColor="#dc2626"
                selectedProvinceMap={selectedProvince}
                setSelectedProvinceMap={setSelectedProvince}
                setSelectedProvinceItem={setSelectedProvinceItem}
              />
            </div>
          ) : (
            <div style={{ height: '600px' }}>
              <MapWithPins
                data={locationData}
                selectedCategory={selectedCategory}
                onPinClick={handlePinClick}
              />
            </div>
          )}
        </div>
        <div className="w-full">
          <h3 className="text-xl font-semibold mb-4">Category Chart</h3>
          <CategoryChart
            data={
              selectedCategory
                ? locationData.filter((l) => l.categories[selectedCategory] > 0)
                : locationData
            }
            selectedCategory={selectedCategory}
          />
        </div>
      </div>
    </div>
  );
}
