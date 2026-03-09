import { instance } from "./instance";

interface TeacherData {
  id?: number;
  department: string;
  position: string;
  name: string;
}

// 교직원 전체 조회
export const getTeacherList = async () => {
  const res = await instance.get("/teacher");
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

// 엑셀 출력
export const downloadTeacherExcel = async () => {
  const res = await instance.get("/teacher/excel", {
    responseType: "blob",
  });
  return res.data;
};

export const downloadTeacherExcel2 = async () => {
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