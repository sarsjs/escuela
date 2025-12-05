"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { subjects, students as allStudents, groups, attendance } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const teacherSubjects = subjects.filter((s) => s.teacherId === 'user-3');

export function TeacherView() {
  // Toast for notifications
  const { toast } = useToast();

  // Local state for attendance per student (by student id)
  const [attendanceState, setAttendanceState] = React.useState<{ [key: string]: boolean }>(() => {
    const initial: { [key: string]: boolean } = {};
    allStudents.forEach((s) => {
      const record = attendance.find(
        (a) => a.studentId === s.id && a.date === '2024-05-20'
      );
      // Default: if no record, present by default except for student-4 as in the demo
      initial[s.id] = record?.present ?? (s.id !== 'student-4');
    });
    return initial;
  });

  // Local state for grades per student-subject combination
  const [gradesState, setGradesState] = React.useState<{ [key: string]: number | '' }>(() => {
    const initial: { [key: string]: number | '' } = {};
    allStudents.forEach((s) => {
      teacherSubjects.forEach((subj) => {
        const gradeObj = s.grades.find((g) => g.subjectId === subj.id);
        initial[`${s.id}-${subj.id}`] = gradeObj?.grade ?? '';
      });
    });
    return initial;
  });

  const handleAttendanceChange = (studentId: string, value: boolean) => {
    setAttendanceState({ ...attendanceState, [studentId]: value });
  };

  const handleGradeChange = (studentId: string, subjectId: string, value: string) => {
    // Convert input to number if possible, else empty string
    const numeric = value === '' ? '' : Number(value);
    setGradesState({
      ...gradesState,
      [`${studentId}-${subjectId}`]: isNaN(numeric as any) ? '' : (numeric as number | ''),
    });
  };

  const handleSaveChanges = () => {
    toast({
      title: 'Cambios guardados',
      description: 'La asistencia y calificaciones han sido registradas.',
    });
  };

  const getStudentsForGroup = (groupId: string) => {
    return allStudents.filter((s) => s.groupId === groupId);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mis Clases</CardTitle>
          <CardDescription>Gestiona la asistencia y calificaciones de tus clases asignadas.</CardDescription>
        </CardHeader>
        <CardContent>
            <Accordion type="single" collapsible className="w-full">
                {teacherSubjects.map(subject => {
                    // Simplified for demo: assuming teacher teaches group-1
                    const group = groups.find(g => g.id === 'group-1'); 
                    if (!group) return null;
                    const students = getStudentsForGroup(group.id);

                    return (
                        <AccordionItem key={subject.id} value={subject.id}>
                            <AccordionTrigger className="text-lg font-semibold">{subject.name} - {group.name}</AccordionTrigger>
                            <AccordionContent className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-md mb-2">Asistencia - 20 de Mayo, 2024</h3>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[80px]"></TableHead>
                                                <TableHead>Nombre del Estudiante</TableHead>
                                                <TableHead className="text-right">Presente</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {students.map((student) => {
                                                const isPresent = attendanceState[student.id];
                                                return (
                                                <TableRow key={student.id}>
                                                    <TableCell>
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={student.avatarUrl} alt={student.name} />
                                                            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                    </TableCell>
                                                    <TableCell>{student.name}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Checkbox
                                                          checked={isPresent}
                                                          onCheckedChange={(checked) => handleAttendanceChange(student.id, Boolean(checked))}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-md mb-2">Ingresar Calificaciones</h3>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Nombre del Estudiante</TableHead>
                                                <TableHead className="text-right w-[100px]">Calificación</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {students.map((student) => {
                                                const gradeKey = `${student.id}-${subject.id}`;
                                                const gradeValue = gradesState[gradeKey];
                                                return (
                                                <TableRow key={student.id}>
                                                    <TableCell>{student.name}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Input
                                                          type="number"
                                                          value={gradeValue ?? ''}
                                                          onChange={(e) => handleGradeChange(student.id, subject.id, e.target.value)}
                                                          className="text-right"
                                                          placeholder="N/A"
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                                <div className="text-right">
                                    <Button onClick={handleSaveChanges}>Guardar Cambios</Button>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )
                })}
            </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
