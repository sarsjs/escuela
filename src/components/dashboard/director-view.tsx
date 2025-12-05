"use client"

import { School, Users, User, FolderKanban, ShieldAlert } from "lucide-react";
import { StatCard } from "./stat-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { users as allUsers, groups, schoolCycles, securityAlerts } from "@/lib/data";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { SecurityAlerts } from "./security-alerts";

export function DirectorView() {
  // Maintain local state for dynamic staff, groups and cycles
  const [staffList, setStaffList] = React.useState(() =>
    allUsers.filter((u) => u.role === "profesor" || u.role === "orientador")
  );
  const counselorsList = staffList.filter((u) => u.role === "orientador");
  const [groupList, setGroupList] = React.useState(() => groups);
  const [cycleList, setCycleList] = React.useState(() => schoolCycles);

  const { toast } = useToast();

  // Dialog state and form fields for adding staff
  const [addStaffOpen, setAddStaffOpen] = React.useState(false);
  const [newStaffName, setNewStaffName] = React.useState("");
  const [newStaffRole, setNewStaffRole] = React.useState("orientador");
  const [newStaffEmail, setNewStaffEmail] = React.useState("");

  // Dialog state and form fields for adding a new group
  const [addGroupOpen, setAddGroupOpen] = React.useState(false);
  const [newGroupName, setNewGroupName] = React.useState("");
  const [newGroupCycleId, setNewGroupCycleId] = React.useState(
    schoolCycles[0]?.id ?? ""
  );
  const [newGroupCounselorId, setNewGroupCounselorId] = React.useState(
    counselorsList[0]?.id ?? ""
  );
  const [newGroupSemester, setNewGroupSemester] = React.useState(1);

  // Dialog state and form fields for adding a new school cycle
  const [addCycleOpen, setAddCycleOpen] = React.useState(false);
  const [newCycleName, setNewCycleName] = React.useState("");

  // Handler to create a new staff member
  const handleCreateStaff = () => {
    if (!newStaffName || !newStaffRole || !newStaffEmail) {
      toast({
        title: "Datos incompletos",
        description: "Por favor completa todos los campos.",
      });
      return;
    }
    const id = `user-${Date.now()}`;
    const avatarSeed = Math.floor(Math.random() * 1000);
    const avatarUrl = `https://picsum.photos/seed/${avatarSeed}/100/100`;
    const newUser = {
      id,
      name: newStaffName,
      role: newStaffRole as any,
      avatarUrl,
      email: newStaffEmail,
    };
    setStaffList([...staffList, newUser]);
    // reset form fields
    setNewStaffName("");
    setNewStaffEmail("");
    setNewStaffRole("orientador");
    setAddStaffOpen(false);
    toast({
      title: "Personal añadido",
      description: `Se agregó a ${newStaffName}.`,
    });
  };

  // Handler to create a new group
  const handleCreateGroup = () => {
    if (!newGroupName || !newGroupCycleId || !newGroupCounselorId) {
      toast({
        title: "Datos incompletos",
        description: "Por favor completa todos los campos del grupo.",
      });
      return;
    }
    const id = `group-${Date.now()}`;
    setGroupList([
      ...groupList,
      {
        id,
        name: newGroupName,
        cycleId: newGroupCycleId,
        counselorId: newGroupCounselorId,
        semester: Number(newGroupSemester),
      },
    ]);
    // reset form
    setNewGroupName("");
    setNewGroupCycleId(cycleList[0]?.id ?? "");
    setNewGroupCounselorId(counselorsList[0]?.id ?? "");
    setNewGroupSemester(1);
    setAddGroupOpen(false);
    toast({
      title: "Grupo creado",
      description: `El grupo ${newGroupName} fue creado.`,
    });
  };

  // Handler to create a new school cycle
  const handleCreateCycle = () => {
    if (!newCycleName) {
      toast({
        title: "Datos incompletos",
        description: "Ingresa un nombre para el ciclo escolar.",
      });
      return;
    }
    const id = `cycle-${Date.now()}`;
    setCycleList([...cycleList, { id, name: newCycleName }]);
    setNewCycleName("");
    setAddCycleOpen(false);
    toast({
      title: "Ciclo escolar creado",
      description: `El ciclo ${newCycleName} fue creado.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total del Personal"
          value={staffList.length.toString()}
          icon={Users}
          description="Profesores y Orientadores"
        />
        <StatCard
          title="Grupos Activos"
          value={groupList.length.toString()}
          icon={School}
          description="En todos los ciclos"
        />
        <StatCard
          title="Orientadores"
          value={counselorsList.length.toString()}
          icon={User}
          description="Gestionando grupos de estudiantes"
        />
        <StatCard
          title="Ciclos Escolares"
          value={cycleList.length.toString()}
          icon={FolderKanban}
          description="Actuales y próximos"
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
         <SecurityAlerts alerts={securityAlerts} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Gestionar Personal</CardTitle>
                <CardDescription>
                  Crea y gestiona cuentas para profesores y orientadores.
                </CardDescription>
              </div>
              {/* Dialog for adding a new staff member */}
              <Dialog open={addStaffOpen} onOpenChange={setAddStaffOpen}>
                <DialogTrigger asChild>
                  <Button>Añadir Personal</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Añadir Personal</DialogTitle>
                    <DialogDescription>
                      Ingresa la información del nuevo personal.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Nombre</label>
                      <Input
                        value={newStaffName}
                        onChange={(e) => setNewStaffName(e.target.value)}
                        placeholder="Nombre completo"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Correo electrónico</label>
                      <Input
                        value={newStaffEmail}
                        onChange={(e) => setNewStaffEmail(e.target.value)}
                        placeholder="Correo"
                        type="email"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Rol</label>
                      <Select
                        value={newStaffRole}
                        onValueChange={(value) => setNewStaffRole(value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccionar Rol" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="orientador">Orientador</SelectItem>
                          <SelectItem value="profesor">Profesor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter className="mt-4">
                    <Button onClick={handleCreateStaff}>Guardar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staffList.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatarUrl} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'orientador' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
             <div className="flex items-center justify-between">
                <div>
                    <CardTitle>Estructura Escolar</CardTitle>
                    <CardDescription>
                    Define ciclos académicos, semestres y grupos de estudiantes.
                    </CardDescription>
                </div>
                {/* Buttons to add cycles and groups */}
                <div className="flex gap-2">
                  {/* Dialog for adding a new cycle */}
                  <Dialog open={addCycleOpen} onOpenChange={setAddCycleOpen}>
                    <DialogTrigger asChild>
                      <Button variant="secondary">Añadir Ciclo</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Nuevo Ciclo Escolar</DialogTitle>
                        <DialogDescription>
                          Escribe el nombre del ciclo escolar.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium">Nombre del Ciclo</label>
                          <Input
                            value={newCycleName}
                            onChange={(e) => setNewCycleName(e.target.value)}
                            placeholder="Ej. Ciclo Escolar 2025-2026"
                          />
                        </div>
                      </div>
                      <DialogFooter className="mt-4">
                        <Button onClick={handleCreateCycle}>Guardar Ciclo</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  {/* Dialog for adding a new group */}
                  <Dialog open={addGroupOpen} onOpenChange={setAddGroupOpen}>
                    <DialogTrigger asChild>
                      <Button>Añadir Grupo</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Nuevo Grupo</DialogTitle>
                        <DialogDescription>
                          Ingresa la información del grupo.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium">Nombre</label>
                          <Input
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                            placeholder="Nombre del grupo"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium">Ciclo Escolar</label>
                          <Select
                            value={newGroupCycleId}
                            onValueChange={(value) => setNewGroupCycleId(value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Seleccionar ciclo" />
                            </SelectTrigger>
                            <SelectContent>
                              {cycleList.map((cycle) => (
                                <SelectItem key={cycle.id} value={cycle.id}>
                                  {cycle.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium">Orientador</label>
                          <Select
                            value={newGroupCounselorId}
                            onValueChange={(value) => setNewGroupCounselorId(value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Seleccionar orientador" />
                            </SelectTrigger>
                            <SelectContent>
                              {counselorsList.map((c) => (
                                <SelectItem key={c.id} value={c.id}>
                                  {c.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium">Semestre</label>
                          <Input
                            type="number"
                            min={1}
                            max={12}
                            value={newGroupSemester}
                            onChange={(e) => setNewGroupSemester(parseInt(e.target.value) || 1)}
                          />
                        </div>
                      </div>
                      <DialogFooter className="mt-4">
                        <Button onClick={handleCreateGroup}>Crear Grupo</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Grupo</TableHead>
                  <TableHead>Semestre</TableHead>
                  <TableHead>Orientador</TableHead>
                  <TableHead>Ciclo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupList.map((group) => {
                  const cycle = cycleList.find((c) => c.id === group.cycleId);
                  const counselor = staffList.find((u) => u.id === group.counselorId);
                  return (
                  <TableRow key={group.id}>
                    <TableCell className="font-medium">{group.name}</TableCell>
                    <TableCell>{group.semester}</TableCell>
                    <TableCell>{counselor?.name || 'N/A'}</TableCell>
                    <TableCell>{cycle?.name || 'N/A'}</TableCell>
                  </TableRow>
                )})}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
