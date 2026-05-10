import instance from "./axiosInstance";

// 급식 유형 타입 정의
export type MealType = "LUNCH" | "LUNCH_SELF" | "DINNER" | "DINNER_SELF";

// API 명세에 따른 응답 데이터 인터페이스
export interface MealItem {
  applyId: number;
  teacherId: number;
  teacherName: string;
  department: string;
  meal: MealType;
  reason: string;
  position: string;
  createdAt: string; // 신청 일시 추가
}

interface ApiResponse<T> {
  data: T;
}

export const getMealList = async (
  date: string,
  meal: MealType,
): Promise<MealItem[]> => {
  const res = await instance.get("/main/apply", {
    params: { meal, date },
  });

  const data = res.data;

  if (Array.isArray(data)) {
    return data;
  }
  if (data && Array.isArray(data.data)) {
    return data.data;
  }

  return [];
};

//급식 신청 등록
export const postMealApplication = async (body: {
  teacherId: number;
  meal: MealType;
  reason: string;
  date: string;
}): Promise<void> => {
  await instance.post("/main/apply", body);
};

// 급식 신청 삭제
export const deleteMealById = async (applyId: number): Promise<void> => {
  await instance.delete(`/main/apply/${applyId}`);
};

// 교사 관련 타입 및 함수
export interface TeacherItem {
  id: number;
  name: string;
  department: string;
  position: string;
}

export const getAdminTeacherList = async (): Promise<TeacherItem[]> => {
  const res = await instance.get<ApiResponse<TeacherItem[]>>("/admin/teacher");
  return res.data.data;
};

export const deleteTeacherById = async (teacherId: number): Promise<void> => {
  await instance.delete(`/admin/teacher/${teacherId}`);
};
