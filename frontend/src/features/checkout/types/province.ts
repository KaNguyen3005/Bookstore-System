export interface Province {
  ProvinceID: number;
  ProvinceName: string;
  CountryID: number;
  Code: string;
  NameExtension: string[];

  IsEnable: number;
  RegionID: number;
  RegionCPN: number;

  UpdatedBy: number;

  CreatedAt: string;
  UpdatedAt: string;

  AreaID: number;

  CanUpdateCOD: boolean;

  Status: number;

  UpdatedEmployee: number;
  UpdatedSource: string;
  UpdatedDate: string;
}

export interface ProvinceResponse {
  code: number;
  result: Province[];
}