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
import { students, subjects, timetable, groups } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle } from "lucide-react";

const currentStudent = students.find(s => s.id === 'student-1');

const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

export function StudentView() {
    const { toast } = useToast();
    const [attendedClasses, setAttendedClasses] = React.useState<Set<string>>(new Set());

    // Simple chat state for contacting the counselor
    const [chatMessages, setChatMessages] = React.useState<
      { sender: 'student' | 'counselor'; text: string }[]
    >([]);
    const [newMessage, setNewMessage] = React.useState("");

    const handleSendMessage = () => {
      const trimmed = newMessage.trim();
      if (!trimmed) return;
      // Append student's message
      const updated = [
        ...chatMessages,
        { sender: 'student', text: trimmed },
        { sender: 'counselor', text: 'Gracias por tu mensaje. Tu orientador se pondrá en contacto contigo pronto.' },
      ];
      setChatMessages(updated);
      setNewMessage("");
    };

    if (!currentStudent) {
        return <Card><CardHeader><CardTitle>Estudiante no encontrado</CardTitle></CardHeader></Card>;
    }

    const studentTimetable = timetable.filter(t => t.groupId === currentStudent.groupId);

    const handleAttendance = (entryId: string, subjectName: string) => {
        // Simulate GPS/QR check
        toast({
            title: "Verificación Exitosa",
            description: `Asistencia registrada para ${subjectName}.`,
        });
        setAttendedClasses(prev => new Set(prev).add(entryId));
    };

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Mis Calificaciones</CardTitle>
                <CardDescription>Tu rendimiento académico para el período actual.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Materia</TableHead>
                            <TableHead className="text-right">Calificación</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentStudent.grades.map(g => {
                            const subject = subjects.find(s => s.id === g.subjectId);
                            const gradeColor = g.grade ? (g.grade >= 90 ? 'bg-green-100 text-green-800' : g.grade >= 80 ? 'bg-blue-100 text-blue-800' : g.grade >= 70 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800') : 'bg-gray-100 text-gray-800';

                            return (
                                <TableRow key={g.subjectId}>
                                    <TableCell className="font-medium">{subject?.name || 'N/A'}</TableCell>
                                    <TableCell className="text-right">
                                        <Badge className={`text-base ${gradeColor}`}>{g.grade || 'N/A'}</Badge>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Mi Horario y Asistencia</CardTitle>
                <CardDescription>Tu horario de clases semanal y registro de asistencia.</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
                 <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                     {daysOfWeek.map(day => (
                         <div key={day} className="space-y-2">
                             <h3 className="font-semibold text-center pb-2 border-b">{day}</h3>
                             <div className="space-y-3 min-h-24">
                                {studentTimetable.filter(t => t.day === day).map(entry => {
                                    const subject = subjects.find(s => s.id === entry.subjectId);
                                    const hasAttended = attendedClasses.has(entry.id);
                                    return (
                                        <div key={entry.id} className="p-3 bg-muted rounded-lg text-sm flex flex-col gap-2">
                                            <div>
                                                <p className="font-semibold">{subject?.name}</p>
                                                <p className="text-xs text-muted-foreground">{entry.time}</p>
                                            </div>
                                            <Button 
                                                size="sm" 
                                                onClick={() => handleAttendance(entry.id, subject?.name || 'la clase')}
                                                disabled={hasAttended}
                                                variant={hasAttended ? 'secondary' : 'default'}
                                            >
                                                {hasAttended ? <><CheckCircle className="mr-2 h-4 w-4" /> Presente</> : 'Pase de Lista'}
                                            </Button>
                                        </div>
                                    )
                                })}
                             </div>
                         </div>
                     ))}
                 </div>
            </CardContent>
        </Card>

        {/* Contact chat card */}
        <Card>
            <CardHeader>
                <CardTitle>Contacto con Orientador</CardTitle>
                <CardDescription>Puedes enviar un mensaje a tu orientador para aclarar dudas o solicitar apoyo.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    <div className="h-48 overflow-y-auto border rounded-md p-2 space-y-2">
                        {chatMessages.length === 0 && (
                            <p className="text-sm text-muted-foreground">Aún no hay mensajes.</p>
                        )}
                        {chatMessages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`max-w-[70%] p-2 rounded-lg text-sm ${msg.sender === 'student' ? 'ml-auto bg-primary text-primary-foreground' : 'mr-auto bg-muted'}`}
                            >
                                {msg.text}
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Escribe tu mensaje..."
                            className="flex-1"
                        />
                        <Button onClick={handleSendMessage}>Enviar</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
