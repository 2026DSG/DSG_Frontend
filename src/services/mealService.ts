import instance from "./instance";

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

/**
 * 급식 신청 목록 조회 (Main)
 * @param date 조회 날짜 (YYYY-MM-DD)
 * @param meal 급식 유형
 */
export const getMealList = async (
  date: string,
  meal: MealType
): Promise<MealItem[]> => {
  // 명세서의 GET /apply?meal=...&date=... 반영
  // 기존 프로젝트 구조에 따라 /main/apply를 유지하거나 /apply로 수정 가능합니다.
  const res = await instance.get("/main/apply", {
    params: { meal, date },
  });

  const data = res.data;

  // 서버 응답 구조에 따른 방어 코드
  if (Array.isArray(data)) {
    return data;
  }
  if (data && Array.isArray(data.data)) {
    return data.data;
  }

  return [];
};

/**
 * 급식 신청 등록
 */
export const postMealApplication = async (body: {
  teacherId: number;
  meal: MealType;
  reason: string;
  date: string;
}): Promise<void> => {
  await instance.post("/main/apply", body);
};

/**
 * 급식 신청 삭제
 */
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