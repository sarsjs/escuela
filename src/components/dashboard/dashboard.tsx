"use client";

import * as React from "react";
import {
  BookCopy,
  Calendar,
  ClipboardCheck,
  GraduationCap,
  Home,
  LayoutGrid,
  School,
  Users,
  ClipboardList,
  UserCog,
} from "lucide-react";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, UserRole } from "@/lib/types";
import { users } from "@/lib/data";
import { Logo } from "@/components/icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DirectorView } from "./director-view";
import { CounselorView } from "./counselor-view";
import { TeacherView } from "./teacher-view";
import { StudentView } from "./student-view";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "../ui/badge";

const navItems = {
  director: [
    { href: "#", icon: Home, label: "Panel Principal" },
    { href: "#", icon: Users, label: "Personal" },
    { href: "#", icon: School, label: "Estructura" },
  ],
  orientador: [
    { href: "#", icon: Home, label: "Panel Principal" },
    { href: "#", icon: ClipboardList, label: "Estudiantes" },
    { href: "#", icon: Calendar, label: "Horarios" },
    { href: "#", icon: BookCopy, label: "Materias" },
  ],
  profesor: [
    { href: "#", icon: LayoutGrid, label: "Mis Clases" },
    { href: "#", icon: ClipboardCheck, label: "Asistencia" },
    { href: "#", icon: GraduationCap, label: "Calificaciones" },
  ],
  estudiante: [
    { href: "#", icon: LayoutGrid, label: "Panel Principal" },
    { href: "#", icon: Calendar, label: "Mi Horario" },
    { href: "#", icon: GraduationCap, label: "Mis Calificaciones" },
  ],
};

const viewTitles = {
    director: "Portal del Director",
    orientador: "Portal del Orientador",
    profesor: "App del Profesor",
    estudiante: "Portal del Estudiante"
}

function RoleSwitcher({
  user,
  setUser,
}: {
  user: User;
  setUser: (user: User) => void;
}) {
  const handleRoleChange = (role: UserRole) => {
    const newUser = users.find((u) => u.role === role) || users[0];
    setUser(newUser);
  }
  return (
    <Select value={user.role} onValueChange={(value) => handleRoleChange(value as UserRole)}>
      <SelectTrigger className="w-auto border-0 bg-transparent shadow-none focus:ring-0">
        <SelectValue placeholder="Seleccionar Rol" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="director">Director</SelectItem>
        <SelectItem value="orientador">Orientador</SelectItem>
        <SelectItem value="profesor">Profesor</SelectItem>
        <SelectItem value="estudiante">Estudiante</SelectItem>
      </SelectContent>
    </Select>
  );
}


function AppSidebar({ user }: { user: User }) {
  const { open } = useSidebar();
  const currentNav = navItems[user.role];
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3">
          <Logo className="size-8 text-primary" />
          <span className="text-lg font-semibold">EduChain</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {currentNav.map((item, index) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                tooltip={{ children: item.label, hidden: open }}
                isActive={index === 0}
              >
                <item.icon />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-sm">
            <span className="font-semibold">{user.name}</span>
            <span className="text-muted-foreground">{user.email}</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

function UserMenu({
  user,
  setUser,
  isSubstitute,
  setIsSubstitute
}: {
  user: User;
  setUser: (role: User) => void;
  isSubstitute: boolean;
  setIsSubstitute: (isSub: boolean) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <UserCog className="h-5 w-5" />
          <span className="sr-only">Menú de usuario</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Simular Rol</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {users.map((u) => (
          <DropdownMenuItem key={u.id} onSelect={() => setUser(u)}>
            {u.name} ({u.role})
          </DropdownMenuItem>
        ))}
         {user.role === 'director' && (
            <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Acciones de Director</DropdownMenuLabel>
                 <DropdownMenuItem onSelect={() => setIsSubstitute(!isSubstitute)}>
                    {isSubstitute ? "Quitar" : "Asignar"} suplencia a orientador
                </DropdownMenuItem>
            </>
         )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


function AppHeader({
    user,
    setUser,
    title,
    isSubstitute,
    setIsSubstitute
}: {
    user: User,
    setUser: (user: User) => void;
    title: string;
    isSubstitute: boolean;
    setIsSubstitute: (isSub: boolean) => void;
}) {
    const role = user.role;
    const showSubstituteBadge = (role === 'orientador' || role === 'director') && isSubstitute;

    return (
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1">
                 <div className="flex items-center gap-2">
                    <h1 className="text-lg font-semibold md:text-2xl">{title}</h1>
                    {showSubstituteBadge && <Badge variant="destructive">SUPLENTE</Badge>}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <RoleSwitcher user={user} setUser={setUser} />
                 <UserMenu user={user} setUser={setUser} isSubstitute={isSubstitute} setIsSubstitute={setIsSubstitute} />
            </div>
        </header>
    )
}

export function Dashboard() {
  const [currentUser, setCurrentUser] = React.useState<User>(users.find(u => u.role === 'director') || users[0]);
  const [isSubstitute, setIsSubstitute] = React.useState(false);
  
  // Logic to handle substitute counselor
  const substituteUser = users.find(u => u.id === 'user-5'); // Lic. Marcus Holloway
  const originalUserForMarcus = users.find(u => u.id === 'user-2'); // Lic. Samuel Chen

  let displayUser = currentUser;
  let view = currentUser.role;

  if (isSubstitute && currentUser.role === 'director' && substituteUser) {
    // Director is viewing as the substitute
    displayUser = substituteUser;
    view = 'orientador';
  } else if (isSubstitute && currentUser.id === 'user-5' && originalUserForMarcus) {
    // The substitute counselor is logged in
    displayUser = originalUserForMarcus;
    view = 'orientador';
  } else if (isSubstitute && currentUser.role === 'orientador' && currentUser.id !== 'user-5') {
     // Another counselor is logged in, but substitute mode is on. We can assign them the substitute tasks.
     // For this demo, let's assume user-2 (Samuel) is the substitute for user-5 (Marcus)
     if (currentUser.id === 'user-2' && substituteUser) {
        displayUser = substituteUser
        view = 'orientador'
     }
  }


  const effectiveUser = isSubstitute && (currentUser.role === 'director' || currentUser.id === 'user-2') && substituteUser ? substituteUser : currentUser;


  const handleSetUser = (user: User) => {
    if (user.role !== 'director' && isSubstitute) {
        setIsSubstitute(false);
    }
    setCurrentUser(user);
  }

  const getTitle = () => {
    if (isSubstitute && (currentUser.role === 'director' || currentUser.role === 'orientador')) {
      const substituteTarget = users.find(u => u.id === 'user-2');
      return `Portal del Orientador (Supliendo a ${substituteTarget?.name || ''})`;
    }
    return viewTitles[currentUser.role];
  }


  return (
    <SidebarProvider defaultOpen>
      <AppSidebar user={currentUser} />
      <SidebarInset>
        <AppHeader 
            user={currentUser} 
            setUser={handleSetUser} 
            title={getTitle()}
            isSubstitute={isSubstitute}
            setIsSubstitute={setIsSubstitute}
        />
        <main className="flex-1 overflow-auto p-4 lg:p-6">
            {currentUser.role === 'director' && <DirectorView />}
            {currentUser.role === 'orientador' && <CounselorView currentUser={effectiveUser} />}
            {currentUser.role === 'profesor' && <TeacherView />}
            {currentUser.role === 'estudiante' && <StudentView />}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
