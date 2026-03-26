export class LocationService {

  static async getProvinces() {
    const res = await fetch("https://provinces.open-api.vn/api/p/");
    return res.json();
  }

  static async getDistricts(provinceCode: number) {
    const res = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
    const data = await res.json();
    return data.districts;
  }

  static async getWards(districtCode: number) {
    const res = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
    const data = await res.json();
    return data.wards;
  }
}