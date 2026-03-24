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


 //공통 응답 타입 (백엔드 구조 모를 때 안전하게 대응)
interface ApiResponse<T> {
  data: T;
}


 //MAIN 급식 신청 목록 조회
 //GET /main/apply
export const getMealList = async (
  date: string,
  meal: MealType
): Promise<MealItem[]> => {
  const res = await instance.get("/main/apply", {
    params: { date, meal },
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


 //[MAIN] 급식 신청 생성
 //POST /main/apply
export const postMealApplication = async (body: {
  teacherId: number;
  meal: MealType;
  reason: string;
  date: string;
}): Promise<void> => {
  await instance.post("/main/apply", body);
};


 // MAIN 급식 신청 삭제
 //DELETE /main/apply/{apply-id}
export const deleteMealById = async (applyId: number): Promise<void> => {
  await instance.delete(`/main/apply/${applyId}`);
};


//ADMIN 교직원 타입 (MealItem 재사용 금지)
export interface TeacherItem {
  id: number;
  name: string;
  department: string;
  position: string;
}

 //ADMIN 교직원 목록 조회
 //GET /admin/teacher
export const getAdminTeacherList = async (): Promise<TeacherItem[]> => {
  const res = await instance.get<ApiResponse<TeacherItem[]>>("/admin/teacher");
  return res.data.data;
};

 //ADMIN 교직원 삭제
 //DELETE /admin/teacher/{teacher-id}
export const deleteTeacherById = async (teacherId: number): Promise<void> => {
  await instance.delete(`/admin/teacher/${teacherId}`);
};

 //ADMIN 신청자 타입
export interface AdminApplyItem {
  id: number;
  teacherName: string;
  meal: MealType;
  reason: string;
  date: string;
}

 //ADMIN 신청자 목록 조회
 // GET /admin/apply
export const getAdminApplyList = async (): Promise<AdminApplyItem[]> => {
  const res = await instance.get<ApiResponse<AdminApplyItem[]>>("/admin/apply");
  return res.data.data;
};
