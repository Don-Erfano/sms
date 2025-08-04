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
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h3 className="font-bold text-lg mb-4">
        Categories ({categories.length})
      </h3>

      <button
        onClick={() => onCategorySelect(undefined)}
        className={`w-full mb-2 p-3 rounded-lg text-left transition-colors ${
          !selectedCategory
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 hover:bg-gray-200'
        }`}
      >
        <div className="flex justify-between items-center">
          <span>All Categories</span>
          <span className="font-bold">
            {categories.reduce((sum, cat) => sum + cat.count, 0)}
          </span>
        </div>
      </button>

      <div className="space-y-2 max-h-96 overflow-y-auto">
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
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
            style={{
              backgroundColor:
                selectedCategory === category.persianName
                  ? category.color
                  : undefined,
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className="w-4 h-4 rounded-full mr-3 flex-shrink-0"
                  style={{ backgroundColor: category.color }}
                />
                <div className="text-left">
                  <div className="font-medium text-sm">{category.name}</div>
                  <div className="text-xs opacity-75" dir="rtl">
                    {category.persianName}
                  </div>
                </div>
              </div>
              <span className="font-bold text-lg">{category.count}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
