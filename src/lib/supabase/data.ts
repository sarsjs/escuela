import { supabase } from "./client";
import type { Group, Student, Subject, TimetableEntry, User } from "@/lib/types";

export async function fetchUsers() {
  const { data, error } = await supabase
    .from<User>("users")
    .select("id, name, role, email, phone, avatar_url as avatarUrl, created_at")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function createUser(payload: Omit<User, "id" | "created_at">) {
  const { data, error } = await supabase
    .from("users")
    .insert({
      name: payload.name,
      role: payload.role,
      email: payload.email,
      phone: payload.phone,
      avatar_url: payload.avatarUrl,
    })
    .select("id, name, role, email, phone, avatar_url as avatarUrl, created_at");
  if (error) throw error;
  return data?.[0] ?? null;
}

export async function removeUser(userId: string) {
  const { error } = await supabase.from<User>("users").delete().eq("id", userId);
  if (error) throw error;
}

export async function fetchGroups() {
  const { data, error } = await supabase
    .from<Group>("groups")
    .select("id, name, cycle as cycleId, counselor_id as counselorId, semester, created_at")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function createGroup(payload: Omit<Group, "id" | "created_at">) {
  const { data, error } = await supabase
    .from("groups")
    .insert({
      name: payload.name,
      cycle: payload.cycleId,
      counselor_id: payload.counselorId,
      semester: payload.semester,
    })
    .select("id, name, cycle as cycleId, counselor_id as counselorId, semester, created_at");
  if (error) throw error;
  return data?.[0] ?? null;
}

export async function fetchSubjects() {
  const { data, error } = await supabase
    .from<Subject>("subjects")
    .select("id, name, teacher_id as teacherId, created_at")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchStudents() {
  const { data, error } = await supabase
    .from<Student>("students")
    .select("id, name, avatar_url as avatarUrl, group_id as groupId, grades, email")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchTimetables() {
  const { data, error } = await supabase
    .from<TimetableEntry>("timetables")
    .select("id, day, time, group_id as groupId, subject_id as subjectId")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchStudentByEmail(email: string) {
  const { data, error } = await supabase
    .from<Student>("students")
    .select("id, name, avatar_url as avatarUrl, group_id as groupId, grades, email")
    .eq("email", email)
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
}

export async function fetchTimetableByGroup(groupId: string) {
  const { data, error } = await supabase
    .from<TimetableEntry>("timetables")
    .select("id, day, time, group_id as groupId, subject_id as subjectId")
    .eq("group_id", groupId)
    .order("day", { ascending: true });
  if (error) throw error;
  return data ?? [];
}
