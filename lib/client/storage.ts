const STUDENT_ID_KEY = "iabl_student_id";

export function getStoredStudentId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(STUDENT_ID_KEY);
}

export function setStoredStudentId(studentId: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STUDENT_ID_KEY, studentId);
}

export function clearStoredStudentId() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STUDENT_ID_KEY);
}
