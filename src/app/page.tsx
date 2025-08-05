'use client';
import React, { useState, useEffect } from 'react';
import CategoryFilter from '@/components/processor/CategoryFilter';
import {
  processLocationData,
  getProvinceData,
  getMainCategories,
  LocationData,
  MainCategoryData,
} from '@/components/processor/data-processor';
import CategoryChart from '@/components/processor/CategoryChart';
import Image from 'next/image';
import MapWrapper from '@/components/processor/MapWrapperProps';

export default function Home() {
  const [selectedMainCategory, setSelectedMainCategory] = useState<
    string | undefined
  >(undefined);
  const [selectedSubCategory, setSelectedSubCategory] = useState<
    string | undefined
  >(undefined);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    null,
  );
  const [locationData, setLocationData] = useState<LocationData[]>([]);
  const [mainCategories, setMainCategories] = useState<MainCategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const processedData = processLocationData();
      const mainCats = getMainCategories(processedData);
      const provData = getProvinceData(processedData);

      setLocationData(processedData);
      setMainCategories(mainCats);
    } catch (error) {
      console.error('Error processing data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePinClick = (location: LocationData) => {
    setSelectedLocation(location);
  };

  const handleMainCategorySelect = (category?: string) => {
    setSelectedMainCategory(category);
    setSelectedLocation(null);
  };

  const handleSubCategorySelect = (category?: string) => {
    setSelectedSubCategory(category);
    setSelectedLocation(null);
  };

  const getFilteredData = () => {
    if (selectedSubCategory) {
      return locationData.filter((l) => l.categories[selectedSubCategory] > 0);
    } else if (selectedMainCategory) {
      const mainCat = mainCategories.find(
        (cat) => cat.persianName === selectedMainCategory,
      );
      if (mainCat) {
        return locationData.filter((l) =>
          mainCat.subcategories.some(
            (subCat) => l.categories[subCat.persianName] > 0,
          ),
        );
      }
    }
    return locationData;
  };

  const getActiveCategory = () => {
    return selectedSubCategory || selectedMainCategory;
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
          mainCategories={mainCategories}
          selectedMainCategory={selectedMainCategory}
          selectedSubCategory={selectedSubCategory}
          onMainCategorySelect={handleMainCategorySelect}
          onSubCategorySelect={handleSubCategorySelect}
        />
      </div>
      <div className="flex gap-4">
        <div className="w-full">
          <div className="h-155 p-4 bg-white rounded-lg shadow-lg">
            <MapWrapper
              data={locationData}
              selectedCategory={getActiveCategory()}
              onPinClick={handlePinClick}
            />
          </div>
        </div>
        <div className="w-full">
          <CategoryChart
            data={getFilteredData()}
            selectedMainCategory={selectedMainCategory}
            selectedSubCategory={selectedSubCategory}
            mainCategories={mainCategories}
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
