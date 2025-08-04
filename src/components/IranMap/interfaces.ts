/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
export interface selectedProvinceType {
  name?: string | undefined;
  id?: string | undefined;
  lat?: string | undefined;
  lng?: string | undefined;
}

export interface provinceType {
  provinceName: string;
  provinceFaName: string;
}

export interface mapDataType {
  [key: string]: number;
}

export interface IranMapWrapperProps {
  data: {};
  dataPercent: {};
  width?: number | string;
  colorRange: string;
  textColor?: string;
  defaultSelectedProvince?: string;
  setSelectedProvinceItem?: any;
  selectedProvinceColor?: string;
  tooltipTitle?: string;
  selectProvinceHandler?: Function;
  deactiveProvinceColor?: string;
  selectedProvinceMap: any;
  setSelectedProvinceMap: any;
}

export interface MapProps {
  textColor: string;
  mapRef: React.RefObject<any>;
  provinceName: null | string;
  pathClickedHandle: Function;
  pathMouseOverHandler: Function;
  data: {};
  dataPercent: {};
  width: number | string | undefined;
}
