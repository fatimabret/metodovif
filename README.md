# Vero Integral Fit (Método VIF) - API RESTful

Una API RESTful robusta, segura y escalable desarrollada como núcleo (Backend) para la plataforma integral de entrenamiento "Método VIF". Este sistema gestiona la lógica de negocio completa, permitiendo la administración dual de la plataforma: un entorno administrativo para la entrenadora y un área exclusiva de consumo de contenido para las alumnas (Frontend en React).

## Tecnologías y Herramientas

*   **Framework:** Laravel 11 (PHP)
*   **Base de Datos:** PostgreSQL
*   **Autenticación:** Laravel Sanctum (Basado en Tokens) y Google OAuth 2.0
*   **Arquitectura:** Layered Architecture (Arquitectura en Capas)
*   **Patrones de Diseño:** Repository Pattern, Dependency Injection (SOLID)

## Arquitectura del Software

Este proyecto fue diseñado con un fuerte enfoque en las buenas prácticas de ingeniería de software, buscando un bajo acoplamiento y una alta cohesión. Se divide estrictamente en 4 capas:

1.  **Controllers (Presentación):** Responsables de interceptar peticiones HTTP, validar *Requests*, manejar la autenticación y retornar respuestas JSON estructuradas. No contienen lógica de negocio.
2.  **Services (Lógica de Negocio):** Centralizan las reglas operativas de la plataforma (ej. actualización de estados de membresía, asignación de rutinas, envío de correos).
3.  **Repositories (Acceso a Datos):** Capa de abstracción sobre el ORM (Eloquent). Aislan las consultas complejas a la base de datos PostgreSQL.
4.  **Interfaces (Contratos):** Definen los métodos que los repositorios deben implementar, garantizando la inversión de dependencias.

## Funcionalidades Principales (Endpoints)

### Seguridad y Autenticación
*   **Login Dual:** Acceso diferenciado mediante roles (Entrenadora / Alumna) utilizando tokens seguros de Sanctum.
*   **SSO (Single Sign-On):** Integración nativa con Google OAuth para registro rápido e inicio de sesión de alumnas.
*   **Recuperación de Contraseñas:** Flujo de recuperación mediante envío de correos SMTP con tokens de seguridad de un solo uso (expiración en 60 minutos) y validaciones de no-repetición de contraseñas.

### Panel de Entrenadora (Admin)
*   **Gestión de Alumnas:** Aprobación de cuentas pendientes, asignación de membresías (planes), control de vencimientos y asignación de rutinas personalizadas.
*   **Catálogo de Contenido:** CRUD completo de ejercicios, administración de disciplinas y sistema de etiquetas (Tags) para filtrado avanzado de rutinas.
*   **Gestión de Membresías:** Creación y modificación de planes de suscripción, marcando planes destacados ("Populares").
*   **Configuración de Landing Page:** Control en tiempo real sobre la página pública, incluyendo galerías de imágenes del estudio, redes sociales, testimonios de alumnas y visibilidad de secciones.
*   **Dashboard Estadístico:** Resumen de métricas clave, alumnas activas y videos con más interacciones.

### Panel de Alumnas (Cliente)
*   **Consumo de Rutinas:** Acceso seguro al catálogo de videos y a las rutinas asignadas específicamente por la entrenadora.
*   **Colecciones Privadas:** Capacidad para alternar y guardar ejercicios en una lista de "Favoritos".
*   **Gestión de Perfil:** Visualización de días restantes de membresía y actualización de credenciales de acceso.

## Esquema de Base de Datos

El sistema implementa un modelo relacional normalizado en PostgreSQL con integridad referencial estricta (llaves foráneas, borrado en cascada y restricciones CHECK). 
Las entidades principales incluyen:
`usuario`, `user` (entrenadora), `nivel_membresia`, `ejercicio`, `rutina`, `categoria`, `testimonio`, `perfil_entrenadora`, junto con múltiples tablas pivot para las relaciones muchos-a-muchos (`categoria_ejercicio`, `ejercicio_favorito`, `etiqueta_ejercicio`, `rutina_ejercicio`).