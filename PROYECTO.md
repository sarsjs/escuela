# Proyecto: EduChain - Sistema de Gestión Escolar

## 1. Concepto del Proyecto

**EduChain** es un prototipo de un sistema de gestión escolar integral diseñado para centralizar y optimizar las operaciones diarias de una institución educativa. La plataforma está construida con una arquitectura basada en roles, proporcionando una interfaz y herramientas específicas para cada tipo de usuario, desde el personal administrativo hasta los estudiantes.

El objetivo principal es crear un ecosistema digital unificado que mejore la comunicación, la seguridad y la eficiencia en la gestión de datos académicos y administrativos.

---

## 2. Funcionalidades Implementadas

Hasta ahora, hemos desarrollado las siguientes características clave, principalmente a nivel de interfaz y con datos de ejemplo (estáticos):

### a. Sistema de Roles y Paneles de Control (Dashboards)
La aplicación cuenta con vistas personalizadas para cuatro roles principales:

*   **Director:** Tiene una visión global de toda la institución.
*   **Orientador:** Gestiona los grupos de estudiantes que le son asignados.
*   **Profesor:** Administra sus clases, incluyendo asistencia y calificaciones.
*   **Estudiante:** Accede a su información académica personal.

### b. Estructura Escolar Jerárquica
Se ha definido y aplicado una estructura organizativa clara:
*   El **Director** tiene la máxima autoridad.
*   El Director asigna a los **Orientadores** la gestión de uno o varios semestres y sus respectivos grupos.
*   Los **Grupos** pertenecen a un semestre (del 1 al 6) y a un ciclo escolar.
*   Los **Profesores** imparten materias específicas.

### c. Simulación de Suplencia de Orientadores
*   El Director puede asignar a un orientador como **suplente** de otro que esté ausente.
*   El orientador suplente puede ver y gestionar la información de los grupos del orientador titular.
*   La interfaz muestra una insignia de **"SUPLENTE"** para indicar cuándo un usuario está actuando en este modo, asegurando que las acciones queden visualmente diferenciadas.

### d. Sistema de Pase de Lista Simulado para Estudiantes
*   En la vista del estudiante, cada clase en el horario tiene un botón de **"Pase de Lista"**.
*   Al presionarlo, la aplicación **simula una verificación** (que en un futuro podría ser por GPS o QR) para registrar la asistencia.
*   Una vez registrada, la interfaz se actualiza para mostrar que el estudiante está "Presente", y el profesor puede ver esta información reflejada en su panel.

### e. Sistema de Alertas de Seguridad Simuladas
*   Se ha implementado un componente de **"Alertas de Seguridad"** para notificar sobre la salida de estudiantes del plantel.
*   **Alertas No Autorizadas:** Si un estudiante sale del perímetro (simulado) y aún tiene clases, se genera una alerta roja para su orientador y el director.
*   **Alertas Autorizadas:** Si la salida es autorizada por el Director o un Orientador, se genera una notificación informativa que incluye un ID de autorización.
*   Cada rol (Director y Orientador) ve únicamente las alertas que le conciernen.

---

## 3. Tecnologías Utilizadas

*   **Framework:** Next.js (con App Router)
*   **Lenguaje:** TypeScript
*   **Librería de UI:** React
*   **Estilos:** Tailwind CSS
*   **Componentes UI:** ShadCN UI
*   **Iconos:** Lucide React

---

## 4. Posibles Mejoras y Próximos Pasos

Este prototipo sienta las bases para una aplicación completa. Las áreas clave para desarrollo futuro son:

### a. Backend y Base de Datos
*   **Reemplazar Datos Estáticos:** La mejora más crítica es conectar la aplicación a una base de datos real (como **Firebase Firestore** o una base de datos SQL) para que la información sea persistente y dinámica.
*   **Implementar API y Lógica de Servidor:** Crear la lógica de negocio en el backend para gestionar las altas, bajas y modificaciones de usuarios, grupos, calificaciones, etc.

### b. Autenticación y Permisos Reales
*   **Sistema de Inicio de Sesión:** Integrar un sistema de autenticación (ej. **Firebase Authentication**) para que los usuarios puedan iniciar sesión con credenciales seguras.
*   **Gestión de Permisos Robusta:** Desarrollar un sistema de control de acceso basado en roles (RBAC) en el backend para hacer cumplir los permisos de manera segura, en lugar de solo en la interfaz.

### c. Funcionalidades Avanzadas
*   **Integración Real de GPS/QR:** Implementar la lógica para verificar la ubicación del estudiante o escanear códigos QR para el pase de lista.
*   **Notificaciones en Tiempo Real:** Utilizar servicios como **Firebase Cloud Messaging** para enviar notificaciones push instantáneas a los dispositivos de los orientadores y directores.
*   **Módulos Adicionales:**
    *   **Comunicación:** Un sistema de mensajería interna entre profesores, orientadores y padres de familia.
    *   **Reportes y Analíticas:** Generación de reportes de rendimiento académico, asistencia y otros indicadores clave.
    *   **Calendario de Eventos:** Un calendario escolar con eventos, exámenes y días festivos.
*   **Integración de IA (Genkit):**
    *   **Asistente Virtual:** Un chatbot para responder preguntas frecuentes de estudiantes o personal.
    *   **Análisis Predictivo:** Usar IA para identificar estudiantes en riesgo académico basándose en su rendimiento y asistencia.
    *   **Generación de Reportes:** Crear resúmenes automáticos del progreso de los estudiantes para los orientadores.
