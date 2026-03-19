import instance from "./instance";

export interface Teacher {
  id: number;
  name: string;
  department: string;
  position: string;
  number: number;
  createdAt: string;
}

// 교직원 등록/수정 요청 타입
interface TeacherData {
  id?: number;
  department: string;
  position: string;
  name: string;
}

// 교직원 전체 조회 GET /teacher
export const getTeacherList = async (): Promise<Teacher[]> => {
  const res = await instance.get("/teacher");
  if (!Array.isArray(res.data)) throw new Error("올바르지 않은 응답입니다.");
  return res.data;
};

// 교직원 등록
export const createTeacher = async (data: TeacherData) => {
  const res = await instance.post("/teacher", data);
  return res.data;
};

// 교직원 삭제
export const deleteTeacher = async (id: number) => {
  const res = await instance.delete(`/teacher/${id}`);
  return res.data;
};

// 엑셀 최초 등록
export const uploadTeacherExcel = async (formData: FormData) => {
  const res = await instance.post("/teacher/excel", formData, {});
  return res.data;
};

// 엑셀 수정 등록
export const updateTeacherExcel = async (formData: FormData) => {
  const res = await instance.put("/teacher/excel", formData);
  return res.data;
};

// 엑셀 다운로드
export const downloadTeacherExcel = async () => {
  const res = await instance.get("/teacher/excel", {
    responseType: "blob",
  });

  const disposition = res.headers["content-disposition"];
  const fileName = disposition
    ? disposition.split('filename="')[1].replace('"', "")
    : "교직원_목록.xlsx";

  const url = URL.createObjectURL(res.data);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
};

// 연도 필터링
export const getYearsFilter = async (year: number): Promise<Teacher[]> => {
  const res = await instance.get("/teacher", { params: { year } });
  console.log("teacher res.data:", res.data); // 구조 확인
  const list = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
  return list;
};