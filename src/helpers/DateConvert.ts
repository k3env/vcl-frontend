import { DateTime } from "luxon";

export function jsToISO(js: Date): string {
  return DateTime.fromJSDate(js).toISO();
}
export function isoToJS(iso: string): Date {
  return DateTime.fromISO(iso).toJSDate();
}
