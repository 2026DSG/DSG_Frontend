import instance from "./instance";

export interface Applicant {
  applyId: number;
  teacherId: number;
  teacherName: string;
  department: string;
  position: string;
  meal: string;
  reason: string;
  createdAt: string;
}

// 신청자 전체 조회
export const getApplyList = async (meal?: string): Promise<Applicant[]> => {
  const res = await instance.get("/apply", { params: meal ? { meal } : {} });
  return res.data;
};

// 월별 엑셀 출력
export const downloadMonthlyExcel = async () => {
  const res = await instance.get("/apply/excel/monthly", {
    responseType: "blob",
  });

  const disposition = res.headers["content-disposition"];
  const fileName = disposition
    ? disposition.split('filename="')[1].replace('"', "")
    : "월별_신청자_목록.xlsx";

  const url = URL.createObjectURL(res.data);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
};

// 총괄표 엑셀 출력
export const downloadSummaryExcel = async () => {
  const res = await instance.get("/apply/excel/summary", {
    responseType: "blob",
  });

  const disposition = res.headers["content-disposition"];
  const fileName = disposition
    ? disposition.split('filename="')[1].replace('"', "")
    : "총괄표.xlsx";

  const url = URL.createObjectURL(res.data);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
};
