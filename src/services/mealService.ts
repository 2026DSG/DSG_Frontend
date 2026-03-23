import instance from "./instance";

export type MealType = "LUNCH" | "LUNCH_SELF" | "DINNER" | "DINNER_SELF";

// 급식 신청 목록 아이템 타입
export interface MealItem {
  id: number;
  name: string;
  reason: string;
  department: string;
  position: string;
}

/**
 * [MAIN] 급식 신청 목록 조회 
 * GET /main/apply
 */
export const getMealList = async (
  date: string,
  meal: MealType
): Promise<MealItem[]> => {
  const res = await instance.get("/main/apply", {
    params: {
      date,
      meal,
    },
  });

  if (!Array.isArray(res.data)) throw new Error("올바르지 않은 응답입니다.");
  return res.data;
};

/**
 * [MAIN] 급식 신청 생성 
 * POST /main/apply
 */
export const postMealApplication = async (body: {
  teacherId: number; 
  meal: MealType;    
  date: string;      
}): Promise<void> => {
  await instance.post("/main/apply", body);
};

/**
 * [MAIN] 급식 신청 삭제 
 * DELETE /main/apply/{apply-id}
 */
export const deleteMealById = async (applyId: number): Promise<void> => {
  await instance.delete(`/main/apply/${applyId}`);
};

/**
 * [ADMIN] 교직원 목록 조회 (전체)
 * GET /admin/teacher
 */
export const getAdminTeacherList = async (): Promise<MealItem[]> => {
  const res = await instance.get("/admin/teacher");
  return res.data;
};

/**
 * [ADMIN] 교직원 삭제
 * DELETE /admin/teacher/{teacher-id}
 */
export const deleteTeacherById = async (teacherId: number): Promise<void> => {
  await instance.delete(`/admin/teacher/${teacherId}`);
};

/**
 * [ADMIN] 신청자 목록 조회 (전체)
 * GET /admin/apply
 */
export const getAdminApplyList = async (): Promise<any[]> => {
  const res = await instance.get("/admin/apply");
  return res.data;
};