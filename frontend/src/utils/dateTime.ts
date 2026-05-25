const VIETNAM_TIME_ZONE = "Asia/Ho_Chi_Minh";
const VIETNAM_TIME_ZONE_OFFSET = "+07:00";
const TIME_ZONE_SUFFIX_PATTERN = /([zZ]|[+-]\d{2}:?\d{2})$/;
const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const parseBackendDate = (value: string) => {
  const trimmed = value.trim();

  if (!trimmed) return null;

  const isoLike = trimmed.replace(" ", "T");
  const withTime = DATE_ONLY_PATTERN.test(isoLike)
    ? `${isoLike}T00:00:00`
    : isoLike;
  const normalizedPrecision = withTime.replace(/(\.\d{3})\d+/, "$1");
  const normalized = TIME_ZONE_SUFFIX_PATTERN.test(normalizedPrecision)
    ? normalizedPrecision
    : `${normalizedPrecision}${VIETNAM_TIME_ZONE_OFFSET}`;
  const date = new Date(normalized);

  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatVietnamDateTime = (value?: string | null) => {
  if (!value) return "";

  const date = parseBackendDate(value);

  if (!date) return "";

  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: VIETNAM_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
};

export const formatVietnamDate = (value?: string | null) => {
  if (!value) return "";

  const date = parseBackendDate(value);

  if (!date) return "";

  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: VIETNAM_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

export const toDateParam = (value?: Date | string | null) => {
  if (!value) return undefined;

  if (typeof value === "string") {
    return value.slice(0, 10);
  }

  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
