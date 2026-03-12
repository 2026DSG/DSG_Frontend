import { instance } from "./instance";

<<<<<<< Updated upstream
export type MealType = "LUNCH" | "LUNCH_SELF" | "DINNER" | "DINNER_SELF";

=======
<<<<<<< Updated upstream
export type MealType = "LUNCH" | "LUNCH_SELF" | "DINNER" | "DINNER_SELF";

=======
// 식사 타입 (백엔드 enum과 일치)
// LUNCH: 중식 학교부담 / LUNCH_SELF: 중식 개인부담
// DINNER: 석식 학교부담 / DINNER_SELF: 석식 개인부담
export type MealType = "LUNCH" | "LUNCH_SELF" | "DINNER" | "DINNER_SELF";

// 급식 신청 목록 아이템 타입
>>>>>>> Stashed changes
>>>>>>> Stashed changes
export interface MealItem {
  id: number;
  name: string;
  reason: string;
  department: string;
  position: string;
}

<<<<<<< Updated upstream
=======
<<<<<<< Updated upstream
>>>>>>> Stashed changes
// 식사 목록 조회
export const getMealList = async (date: string, meal: MealType): Promise<MealItem[]> => {
  const res = await instance.get("/meals", { params: { date, meal } });
  
  if (!Array.isArray(res.data)) {
    throw new Error("올바르지 않은 응답입니다.");  // ← 이러면 catch로 떨어져서 토스트 뜸
  }
  
  return res.data;
};

// 식사 신청 삭제
export const deleteMealById = async (id: number): Promise<void> => {
  await instance.delete(`/meals/${id}`);
<<<<<<< Updated upstream
=======
=======
// 급식 신청 목록 조회 GET /meals?date=2025-01-01&meal=LUNCH
export const getMealList = async (date: string, meal: MealType): Promise<MealItem[]> => {
  const res = await instance.get("/meals", { params: { date, meal } });
  if (!Array.isArray(res.data)) throw new Error("올바르지 않은 응답입니다.");
  return res.data;
};

// 급식 신청 삭제 DELETE /meals/:id
export const deleteMealById = async (id: number): Promise<void> => {
  await instance.delete(`/meals/${id}`);
};

// 급식 신청 생성 POST /meals
export const postMealApplication = async (body: {
  teacherId: number; // 신청할 교직원 ids
  meal: MealType;    // 식사 타입
  date: string;      // 신청 날짜 (2025-01-01 형식)
}): Promise<void> => {
  await instance.post("/meals", body);
>>>>>>> Stashed changes
>>>>>>> Stashed changes
};