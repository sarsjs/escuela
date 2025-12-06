-- Run this script in the Supabase SQL editor or via supabase CLI after the schema is in place.
-- It enables row level security and keeps students/timetables scoped to the correct roles.

-- Enable RLS on the tables we want to protect.
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetables ENABLE ROW LEVEL SECURITY;

-- Allow the director to read every student record.
CREATE POLICY IF NOT EXISTS "Directores pueden ver estudiantes"
  ON public.students
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.users
      WHERE id = auth.uid()
        AND role = 'director'
    )
  );

-- Allow an orientador to read the students that belong to the groups they manage.
CREATE POLICY IF NOT EXISTS "Orientadores ven sus estudiantes"
  ON public.students
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.groups g
      JOIN public.users u ON u.id = g.counselor_id
      WHERE g.id = students.group_id
        AND u.id = auth.uid()
        AND u.role = 'orientador'
    )
  );

-- Let each student read only their own profile via the email that matches the authenticated user.
CREATE POLICY IF NOT EXISTS "Estudiantes ven su propio registro"
  ON public.students
  FOR SELECT
  USING (
    (auth.jwt() ->> 'email') IS NOT NULL
    AND lower(students.email) = lower(auth.jwt() ->> 'email')
  );

-- Allow staff (director/orientador/profesor) to read the entire timetable.
CREATE POLICY IF NOT EXISTS "Personal puede ver horarios generales"
  ON public.timetables
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.users
      WHERE id = auth.uid()
        AND role IN ('director', 'orientador', 'profesor')
    )
  );

-- Allow a student to see the timetable rows that belong to their group.
CREATE POLICY IF NOT EXISTS "Estudiante ve su horario"
  ON public.timetables
  FOR SELECT
  USING (
    (auth.jwt() ->> 'email') IS NOT NULL
    AND EXISTS (
      SELECT 1
      FROM public.students s
      WHERE s.group_id = timetables.group_id
        AND lower(s.email) = lower(auth.jwt() ->> 'email')
    )
  );
