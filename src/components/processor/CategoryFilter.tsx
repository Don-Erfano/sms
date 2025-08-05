'use client';
import React from 'react';
import { MainCategoryData } from '@/components/processor/data-processor';

interface CategoryFilterProps {
  mainCategories: MainCategoryData[];
  selectedMainCategory?: string;
  selectedSubCategory?: string;
  onMainCategorySelect: (category?: string) => void;
  onSubCategorySelect: (category?: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  mainCategories,
  selectedMainCategory,
  selectedSubCategory,
  onMainCategorySelect,
  onSubCategorySelect,
}) => {
  const handleMainCategoryClick = (category: string) => {
    if (selectedMainCategory === category) {
      onMainCategorySelect(undefined);
      onSubCategorySelect(undefined);
    } else {
      onMainCategorySelect(category);
      onSubCategorySelect(undefined);
    }
  };

  const getTotalCount = () => {
    return mainCategories.reduce((total, cat) => total + cat.count, 0);
  };

  return (
    <div className="min-w-[700px] mx-auto bg-white flex p-4 rounded-lg shadow-lg">
      <button
        onClick={() => {
          onMainCategorySelect(undefined);
          onSubCategorySelect(undefined);
        }}
        className={`w-30 ml-2 p-3 rounded-lg text-left transition-colors ${
          !selectedMainCategory && !selectedSubCategory
            ? 'bg-blue-500 text-white'
            : 'bg-gray-300 hover:bg-gray-500'
        }`}
      >
        <div className="flex-col justify-between items-center">
          <span className="whitespace-nowrap w-full text-xs">
            تمام دسته بندی ها
          </span>
          <h3 className="text-sm mt-3 text-center">({getTotalCount()})</h3>
        </div>
      </button>

      <div className="flex space-x-2 max-h-96 overflow-x-auto">
        {mainCategories.map((mainCategory) => (
          <button
            key={mainCategory.persianName}
            onClick={() => handleMainCategoryClick(mainCategory.persianName)}
            className={`w-full p-3 rounded-lg text-center transition-colors ${
              selectedMainCategory === mainCategory.persianName
                ? 'text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            style={{
              backgroundColor:
                selectedMainCategory === mainCategory.persianName
                  ? mainCategory.color
                  : undefined,
            }}
          >
            <div className="flex-col items-center justify-between min-w-35">
              <div className="flex items-center justify-center space-x-2">
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: mainCategory.color }}
                />
                <div className="text-center">
                  <div className="text-sm whitespace-nowrap" dir="rtl">
                    {mainCategory.persianName}
                  </div>
                </div>
              </div>
              <span className="font-bold text-lg text-center mt-3 items-center flex justify-center">
                {mainCategory.count}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
