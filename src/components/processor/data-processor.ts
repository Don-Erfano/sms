import csvData from '@/json-data/csvjson.json';

export interface LocationData {
  id: string;
  lat: number;
  lng: number;
  categories: {
    [key: string]: number;
  };
  totalCount: number;
}

export interface CategoryData {
  name: string;
  persianName: string;
  count: number;
  color: string;
}

export const categoryConfig: {
  [key: string]: { name: string; color: string };
} = {
  اپراتوری: { name: 'اپراتوری', color: '#FF6B6B' },
  حاکمیتی: { name: 'حاکمیتی', color: '#4ECDC4' },
  استخدام: { name: 'استخدام', color: '#45B7D1' },
  تبلیغاتی: { name: 'تبلیغاتی', color: '#96CEB4' },
  آموزشگاه: { name: 'آموزشگاه', color: '#FFEAA7' },
  املاک: { name: 'املاک', color: '#DDA0DD' },
  'تجهیزات و خدمات خودرو': { name: 'تجهیزات و خدمات خودرو', color: '#98D8C8' },
  تفریحی: { name: 'تفریحی', color: '#F7DC6F' },
  خدمات: { name: 'خدمات', color: '#BB8FCE' },
  'خدمات منزل و دکوراسیون': {
    name: 'خدمات منزل و دکوراسیون',
    color: '#85C1E9',
  },
  'رویداد و فرهنگی': { name: 'رویداد و فرهنگی', color: '#F8C471' },
  زیبایی: { name: 'زیبایی', color: '#F1948A' },
  'فروشگاه‌های عمومی': { name: 'فروشگاه‌های عمومی', color: '#82E0AA' },
  ورزشی: { name: 'ورزشی', color: '#AED6F1' },
  'پزشکی و سلامت': { name: 'پزشکی و سلامت', color: '#A9DFBF' },
  'پوشاک و مد': { name: 'پوشاک و مد', color: '#D7BDE2' },
  'کافه و رستوران': { name: 'کافه و رستوران', color: '#F9E79F' },
  گردشگری: { name: 'گردشگری', color: '#A3E4D7' },
};

export const processLocationData = (): LocationData[] => {
  return csvData
    .map((item: any, index: number) => {
      const locationStr = item.location_;

      const coords = locationStr.split(',');
      if (coords.length !== 2) {
        console.warn(`invalid coordinate ${index}:`, locationStr);
        return null;
      }

      const lat = parseFloat(coords[0]);
      const lng = parseFloat(coords[1]);

      if (isNaN(lat) || isNaN(lng)) {
        return null;
      }

      const categories: { [key: string]: number } = {};
      let totalCount = 0;

      Object.keys(item).forEach((key) => {
        if (key !== 'location_') {
          const count = parseInt(item[key]) || 0;
          if (count > 0) {
            categories[key] = count;
            totalCount += count;
          }
        }
      });

      if (totalCount === 0) {
        return null;
      }

      return {
        id: `location-${index}`,
        lat,
        lng,
        categories,
        totalCount,
      };
    })
    .filter((item): item is LocationData => item !== null);
};

export const getCategoryStats = (data: LocationData[]): CategoryData[] => {
  const stats: { [key: string]: number } = {};

  data.forEach((location) => {
    Object.entries(location.categories).forEach(([category, count]) => {
      stats[category] = (stats[category] || 0) + count;
    });
  });

  return Object.entries(stats)
    .filter(([_, count]) => count > 0)
    .map(([category, count]) => ({
      name: categoryConfig[category]?.name || category,
      persianName: category,
      count,
      color: categoryConfig[category]?.color || '#999999',
    }))
    .sort((a, b) => b.count - a.count);
};

export const getProvinceData = (data: LocationData[]) => {
  const provinceData: { [key: string]: number } = {};

  data.forEach((location) => {
    let province = 'Other';

    if (
      location.lat >= 35.5 &&
      location.lat <= 36 &&
      location.lng >= 51 &&
      location.lng <= 52
    ) {
      province = 'Tehran';
    } else if (
      location.lat >= 32.5 &&
      location.lat <= 33 &&
      location.lng >= 51.5 &&
      location.lng <= 52.5
    ) {
      province = 'Isfahan';
    } else if (
      location.lat >= 36 &&
      location.lat <= 37 &&
      location.lng >= 59 &&
      location.lng <= 60
    ) {
      province = 'Mashhad';
    } else if (
      location.lat >= 29.5 &&
      location.lat <= 30 &&
      location.lng >= 52.5 &&
      location.lng <= 53.5
    ) {
      province = 'Fars';
    } else if (
      location.lat >= 26 &&
      location.lat <= 27.5 &&
      location.lng >= 53.5 &&
      location.lng <= 57
    ) {
      province = 'Hormozgan';
    } else if (
      location.lat >= 27 &&
      location.lat <= 28 &&
      location.lng >= 56 &&
      location.lng <= 58
    ) {
      province = 'Sistan and Baluchestan';
    }

    provinceData[province] =
      (provinceData[province] || 0) + location.totalCount;
  });

  return provinceData;
};
