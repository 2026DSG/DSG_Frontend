import { instance } from "./instance";

// 신청자 전체 조회
export const getApplyList = async () => {
  const res = await instance.get("/apply");
  return res.data;
};

// 월별 엑셀 출력
export const downloadMonthlyExcel = async () => {
  const res = await instance.get("/apply/excel/monthly", {
    responseType: "blob",
  });
  return res.data;
};

// 총괄표 엑셀 출력
export const downloadSummaryExcel = async () => {
  const res = await instance.get("/apply/excel/summary", {
    responseType: "blob",
  });
  return res.data;
};