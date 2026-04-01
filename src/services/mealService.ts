import instance from "./instance";

export type MealType = "LUNCH" | "LUNCH_SELF" | "DINNER" | "DINNER_SELF";

export interface MealItem {
  applyId: number;
  teacherName: string; 
  reason: string;
  department: string;
  position: string;
}

interface ApiResponse<T> {
  data: T;
}

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

export const postMealApplication = async (body: {
  teacherId: number;
  meal: MealType;
  reason: string;
  date: string;
}): Promise<void> => {
  await instance.post("/main/apply", body);
};

export const deleteMealById = async (applyId: number): Promise<void> => {
  await instance.delete(`/main/apply/${applyId}`);
};

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

export interface AdminApplyItem {
  id: number;
  teacherName: string;
  meal: MealType;
  reason: string;
  date: string;
}

export const getAdminApplyList = async (): Promise<AdminApplyItem[]> => {
  const res = await instance.get<ApiResponse<AdminApplyItem[]>>("/admin/apply");
  return res.data.data;
};
