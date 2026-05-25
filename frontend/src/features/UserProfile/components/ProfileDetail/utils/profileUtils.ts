import { toDateParam } from "../../../../../utils/dateTime";

export const normalizeDob = (dob: any): string => {
  if (!dob) return "";

  if (typeof dob === "string") {
    return dob.includes("T") ? dob.split("T")[0] : dob;
  }

  if (dob instanceof Date) {
    return toDateParam(dob) ?? "";
  }

  if (typeof dob === "number") {
    return toDateParam(new Date(dob)) ?? "";
  }

  return "";
};

export const calculateAge = (dobString: string) => {
  const today = new Date();
  const birth = new Date(dobString);

  let age = today.getFullYear() - birth.getFullYear();

  const monthDiff = today.getMonth() - birth.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birth.getDate())
  ) {
    age--;
  }

  return age;
};
