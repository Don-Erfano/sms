'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { LocationData } from '@/components/processor/data-processor';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface CategoryChartProps {
  data: LocationData[];
  selectedCategory?: string;
}

const CategoryChart: React.FC<CategoryChartProps> = ({
  data,
  selectedCategory,
}) => {
  const categoryTotals = React.useMemo(() => {
    const totals: { [key: string]: number } = {};

    data.forEach((location) => {
      Object.entries(location.categories).forEach(([category, count]) => {
        if (count > 0) {
          totals[category] = (totals[category] || 0) + count;
        }
      });
    });

    return totals;
  }, [data]);

  const categoryMapping: { [key: string]: string } = {
    اپراتوری: 'اپراتوری',
    حاکمیتی: 'حاکمیتی',
    استخدام: 'استخدام',
    تبلیغاتی: 'تبلیغاتی',
    آموزشگاه: 'آموزشگاه',
    املاک: 'املاک',
    'تجهیزات و خدمات خودرو': 'تجهیزات و خدمات خودرو',
    تفریحی: 'تفریحی',
    خدمات: 'خدمات',
    'خدمات منزل و دکوراسیون': 'خدمات منزل و دکوراسیون',
    'رویداد و فرهنگی': 'رویداد و فرهنگی',
    زیبایی: 'زیبایی',
    'فروشگاه‌های عمومی': 'فروشگاه‌های عمومی',
    ورزشی: 'ورزشی',
    'پزشکی و سلامت': 'پزشکی و سلامت',
    'پوشاک و مد': 'پوشاک و مد',
    'کافه و رستوران': 'کافه و رستوران',
    گردشگری: 'گردشگری',
  };

  const chartData = React.useMemo(() => {
    const categories = Object.keys(categoryTotals).filter(
      (cat) => categoryTotals[cat] > 0,
    );
    const values = categories.map((cat) => categoryTotals[cat]);
    const labels = categories.map((cat) => categoryMapping[cat] || cat);

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
            text: 'Count',
          },
        },
        fill: {
          opacity: 1,
          colors: selectedCategory
            ? categories.map((cat) =>
                cat === selectedCategory ? '#3B82F6' : '#0e0e0e',
              )
            : ['#3B82F6'],
        },
        tooltip: {
          y: {
            formatter: function (val: number) {
              return val + ' items';
            },
          },
        },
        title: {
          text: selectedCategory
            ? `${categoryMapping[selectedCategory] || selectedCategory} Distribution`
            : 'Category Distribution',
          align: 'center',
        },
        legend: {
          show: false,
        },
      },
    };
  }, [categoryTotals, selectedCategory, categoryMapping]);

  if (Object.keys(categoryTotals).length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-black">No data to display</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <Chart
        // @ts-ignore
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height={400}
      />
    </div>
  );
};

export default CategoryChart;
