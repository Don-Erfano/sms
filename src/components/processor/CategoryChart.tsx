'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import {
  LocationData,
  MainCategoryData,
} from '@/components/processor/data-processor';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface CategoryChartProps {
  data: LocationData[];
  selectedMainCategory?: string;
  selectedSubCategory?: string;
  mainCategories: MainCategoryData[];
}

const CategoryChart: React.FC<CategoryChartProps> = ({
  data,
  selectedMainCategory,
  selectedSubCategory,
  mainCategories,
}) => {
  const chartData = React.useMemo(() => {
    let categories: string[] = [];
    let values: number[] = [];
    let labels: string[] = [];
    let colors: string[] = [];

    if (selectedSubCategory) {
      const categoryTotals: { [key: string]: number } = {};

      data.forEach((location) => {
        Object.entries(location.categories).forEach(([category, count]) => {
          if (count > 0) {
            categoryTotals[category] = (categoryTotals[category] || 0) + count;
          }
        });
      });

      categories = Object.keys(categoryTotals).filter(
        (cat) => categoryTotals[cat] > 0,
      );
      values = categories.map((cat) => categoryTotals[cat]);
      labels = categories;

      colors = categories.map((cat) =>
        cat === selectedSubCategory ? '#3B82F6' : '#94A3B8',
      );
    } else if (selectedMainCategory) {
      const mainCat = mainCategories.find(
        (cat) => cat.persianName === selectedMainCategory,
      );
      if (mainCat) {
        categories = mainCat.subcategories.map((sub) => sub.persianName);
        values = mainCat.subcategories.map((sub) => sub.count);
        labels = mainCat.subcategories.map((sub) => sub.persianName);
        colors = mainCat.subcategories.map((sub) => sub.color);
      }
    } else {
      categories = mainCategories.map((cat) => cat.persianName);
      values = mainCategories.map((cat) => cat.count);
      labels = mainCategories.map((cat) => cat.persianName);
      colors = mainCategories.map((cat) => cat.color);
    }

    return {
      series: [
        {
          name: 'Count',
          data: values,
        },
      ],
      options: {
        chart: {
          type: 'bar' as const,
          height: 400,
          stacked: false,
          toolbar: {
            show: true,
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '80%',
          },
        },
        dataLabels: {
          enabled: true,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent'],
        },
        xaxis: {
          categories: labels,
          labels: {
            rotate: -45,
            style: {
              fontSize: '12px',
            },
          },
        },
        yaxis: {
          title: {
            text: 'تعداد',
            style: {
              fontSize: '14px',
            },
          },
        },
        fill: {
          opacity: 1,
          colors: colors.length > 0 ? colors : ['#3B82F6'],
        },
        tooltip: {
          y: {
            formatter: function (val: number) {
              return val + ' items';
            },
          },
        },
        title: {
          text: selectedSubCategory
            ? `${selectedSubCategory}`
            : selectedMainCategory
              ? `${selectedMainCategory}`
              : 'تمام دسته بندی ها',
          align: 'center',
        },
        legend: {
          show: false,
        },
      },
    };
  }, [data, selectedMainCategory, selectedSubCategory, mainCategories]);

  if (chartData.series[0].data.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 bg-gray-50 rounded-lg">
        <p className="text-black">داده ای برای نمایش وجود ندارد</p>
      </div>
    );
  }

  return (
    <div className="bg-white h-79 p-4 rounded-lg shadow-lg">
      <Chart
        // @ts-ignore
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height={300}
      />
    </div>
  );
};

export default CategoryChart;
