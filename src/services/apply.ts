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
  try {
    const res = await instance.get("/admin/apply", {
      params: meal ? { meal } : {},
    });
    const list = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
    return list;
  } catch (err: unknown) {
    const axiosErr = err as {
      response?: { status?: number; data?: { message?: string } };
    };
    const status = axiosErr?.response?.status;
    const message = axiosErr?.response?.data?.message ?? "알 수 없는 오류";

    if (status === 400) {
      return [];
    }

    throw new Error(`[${status}] ${message}`);
  }
};

// 월별 엑셀 출력
export const downloadMonthlyExcel = async () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const res = await instance.get("/admin/apply/excel/monthly", {
    params: {
      year,
      month,
    },
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
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const res = await instance.get("/admin/apply/excel/summary", {
    params: {
      year,
      month,
    },
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
