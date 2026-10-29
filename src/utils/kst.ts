// src/utils/kst.ts
export type BaseMealType = "LUNCH" | "DINNER";

export const getKstToday = (): string =>
  new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });

export const getDefaultMealType = (): BaseMealType => {
  const [h, m] = new Date()
    .toLocaleTimeString("en-GB", {
      timeZone: "Asia/Seoul",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    })
    .split(":")
    .map(Number);

  return h * 60 + m >= 13 * 60 + 30 ? "DINNER" : "LUNCH";
};

export const shiftDate = (dateString: string, days: number): string => {
  const [y, m, d] = dateString.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
};

export const getWeekday = (dateString: string): string => {
  const [y, m, d] = dateString.split("-").map(Number);
  const day = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return ["일", "월", "화", "수", "목", "금", "토"][day];
};

export const isAllowedOtherDate = (dateString: string): boolean =>
  dateString > getKstToday();
