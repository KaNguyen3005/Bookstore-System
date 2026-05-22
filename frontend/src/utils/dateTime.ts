const VIETNAM_TIME_ZONE = "Asia/Ho_Chi_Minh";
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
    : `${normalizedPrecision}Z`;
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
