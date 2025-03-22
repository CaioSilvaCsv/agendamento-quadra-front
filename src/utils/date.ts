import { formatInTimeZone } from "date-fns-tz";

const TIMEZONE = "UTC";

export function formatDateUTC(date: string | Date, format = "dd/MM/yyyy") {
  return formatInTimeZone(date, TIMEZONE, format);
}

export function formatHourUTC(date: string | Date) {
  return formatInTimeZone(date, TIMEZONE, "HH:mm");
}
