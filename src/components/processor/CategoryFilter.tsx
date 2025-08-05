'use client';
import React from 'react';
import { CategoryData } from '@/components/processor/data-processor';

interface CategoryFilterProps {
  categories: CategoryData[];
  selectedCategory?: string;
  onCategorySelect: (category?: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
}) => {
  return (
    <div className="min-w-[700px] mx-auto bg-white flex p-4 rounded-lg shadow-lg">
      <button
        onClick={() => onCategorySelect(undefined)}
        className={`w-30 p-3 rounded-lg text-left transition-colors ${
          !selectedCategory
            ? 'bg-blue-500 text-white'
            : 'bg-gray-300 hover:bg-gray-500'
        }`}
      >
        <div className="flex-col justify-between items-center">
          <span className="whitespace-nowrap">تمام دسته بندی ها</span>
          <h3 className="font-bold text-lg mt-3 text-center">
            ({categories.length})
          </h3>
        </div>
      </button>

      <div className="flex space-x-2 max-h-96 overflow-x-auto">
        {categories.map((category) => (
          <button
            key={category.persianName}
            onClick={() =>
              onCategorySelect(
                selectedCategory === category.persianName
                  ? undefined
                  : category.persianName,
              )
            }
            className={`w-full p-3 rounded-lg text-left transition-colors ${
              selectedCategory === category.persianName
                ? 'text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            style={{
              backgroundColor:
                selectedCategory === category.persianName
                  ? category.color
                  : undefined,
            }}
          >
            <div className="flex-col items-center justify-between w-35">
              <div className="flex items-center justify-center space-x-2 ">
                <div className="text-left">
                  <div className="text-sm whitespace-nowrap " dir="rtl">
                    {category.persianName}
                  </div>
                </div>
                <div
                  className="w-4 h-4 rounded-full  flex-shrink-0"
                  style={{ backgroundColor: category.color }}
                />
              </div>
              <span className="font-bold text-lg text-center items-center flex justify-center mt-3">
                {category.count}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
