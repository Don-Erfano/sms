import React, { useEffect, useRef, useState } from 'react';
import type {
  IranMapWrapperProps,
  mapDataType,
  provinceType,
  selectedProvinceType,
} from './interfaces';
import './iran-map.css';
import { provinces } from './provinces';
import IranMapWrapper from './IranMapWrapper';

const IranMap: React.FC<IranMapWrapperProps> = ({
  data,
  dataPercent,
  width,
  colorRange,
  setSelectedProvinceItem,
  textColor = '#4FA9C7',
  deactiveProvinceColor = '#e6e6e6',
  selectedProvinceColor,
  selectedProvinceMap: selectedProvince,
  setSelectedProvinceMap: setSelectedProvince,
}) => {
  const mapRef = useRef(null);
  const [provinceName, setProvinceName] = useState<null | string>(null);

  const pathMouseOverHandler = (event: any) => {
    const path = event.target;
    setProvinceName(path.dataset.name);
  };

  const pathClickedHandle = (provinceData: selectedProvinceType) => {
    setSelectedProvince({
      name: provinceData?.name,
      id: provinceData?.id,
      lat: provinceData?.lat,
      lng: provinceData?.lng,
    });
    setSelectedProvinceItem({
      name: provinceData?.name,
      id: provinceData?.id,
      lat: provinceData?.lat,
      lng: provinceData?.lng,
    });
  };

  const setPathBackgrounds = (svg: Element, mapData: mapDataType) => {
    const polygons = svg.querySelectorAll('polygon');
    const paths = svg.querySelectorAll('path');

    const values = Object.values(mapData);
    const min = Math.min(...values);
    const max = Math.max(...values);

    const setColorHandler = (element: SVGPathElement) => {
      const title = provinces?.find(
        (item: provinceType) => item.provinceFaName === element.getAttribute('data-name')
      )?.provinceName;

      const selectedItem = provinces?.find(
        (province: provinceType) => province.provinceFaName === selectedProvince?.name
      )?.provinceFaName;

      if (title) {
        const count = mapData[title.trim()];
        if (count === 0) {
          element.style.fill = deactiveProvinceColor;
        } else {
          if (min !== max) {
            const alpha = Math.max(0.1, Math.min(1, (count - min) / (max - min)));
            const usageColor = `rgba(${colorRange}, ${alpha})`;
            element.style.fill = usageColor;
          } else {
            const usageColor = `rgba(${colorRange}, ${min > 0 ? 1 : 0.1})`;
            element.style.fill = usageColor;
          }
        }
      }
      if (element.getAttribute('data-name') === selectedItem && selectedProvinceColor) {
        element.style.fill = selectedProvinceColor;
      }
    };

    paths.forEach((path: SVGPathElement) => {
      setColorHandler(path);
    });

    polygons.forEach((polygon: SVGPathElement) => {
      setColorHandler(polygon);
    });
  };

  useEffect(() => {
    if (mapRef.current) {
      setPathBackgrounds(mapRef.current, data);
    }
  }, [mapRef, selectedProvince]);

  return (
    <div className="iran-map-wrapper" style={{ width: width ? width : 500 }}>
      <IranMapWrapper
        mapRef={mapRef}
        textColor={textColor}
        provinceName={provinceName}
        pathClickedHandle={pathClickedHandle}
        pathMouseOverHandler={pathMouseOverHandler}
        data={data}
        dataPercent={dataPercent}
        width={width}
      />
    </div>
  );
};

export default IranMap;
