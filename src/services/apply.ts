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

const parseBlobError = async (err: unknown): Promise<never> => {
  const axiosErr = err as {
    response?: { status?: number; data?: Blob };
  };
  const status = axiosErr?.response?.status;

  if (status === 404) {
    throw Object.assign(new Error("데이터 없음"), { status: 404 });
  }

  try {
    const text = await axiosErr.response?.data?.text();
    const json = JSON.parse(text ?? "");
    const message = json?.message ?? "알 수 없는 오류";
    throw new Error(`[${status}] ${message}`);
  } catch (innerErr) {
    if (innerErr instanceof Error && innerErr.message.startsWith("[")) {
      throw innerErr;
    }
    throw new Error(`[${status ?? "unknown"}] 알 수 없는 오류`);
  }
};

// 신청자 전체 조회
export const getApplyList = async (date?: string): Promise<Applicant[]> => {
  try {
    const res = await instance.get("/admin/apply", {
      params: {
        date,
      },
    });
    const list = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
    return list;
  } catch (err: unknown) {
    const axiosErr = err as {
      response?: { status?: number; data?: { message?: string } };
    };
    const status = axiosErr?.response?.status;

    if (
      status === 400 &&
      axiosErr.response?.data?.message === "신청자가 없습니다."
    ) {
      return [];
    }

    throw new Error(
      `[${status ?? "unknown"}] ${axiosErr.response?.data?.message ?? "알 수 없는 오류"}`,
    );
  }
};

// 월별 엑셀 출력
export const downloadMonthlyExcel = async (year: number, month: number) => {
  try {
    const res = await instance.get("/admin/apply/excel/monthly", {
      params: { year, month },
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
  } catch (err) {
    await parseBlobError(err);
  }
};

// 총괄표 엑셀 출력
export const downloadSummaryExcel = async (year: number, month: number) => {
  try {
    const res = await instance.get("/admin/apply/excel/summary", {
      params: { year, month },
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
  } catch (err) {
    await parseBlobError(err);
  }
};
