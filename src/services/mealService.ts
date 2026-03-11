import { instance } from "./instance";

export type MealType = "LUNCH" | "LUNCH_SELF" | "DINNER" | "DINNER_SELF";

export interface MealItem {
  id: number;
  name: string;
  reason: string;
  department: string;
  position: string;
}

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
};