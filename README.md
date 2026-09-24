# Vero Integral Fit - API RESTful 🏋️‍♀️💻

Una API RESTful robusta y escalable desarrollada para centralizar la gestión de una plataforma de entrenamiento físico y fitness. Este sistema permite la administración de membresías, catálogo de ejercicios, control de alumnas y registro de pagos, sirviendo como núcleo (Backend) para una futura aplicación cliente en React.

## Tecnologías y Herramientas

*   **Framework:** Laravel 11 (PHP)
*   **Base de Datos:** PostgreSQL
*   **Arquitectura:** Layered Architecture (Arquitectura en Capas)
*   **Patrones de Diseño:** Repository Pattern, Dependency Injection (SOLID)

## Arquitectura del Software

Este proyecto fue diseñado con un fuerte enfoque en las buenas prácticas de ingeniería de software, buscando un bajo acoplamiento y una alta cohesión. Se divide estrictamente en 4 capas:

1.  **Controllers (Presentación):** Responsables únicamente de interceptar peticiones HTTP, validar *Requests* y retornar respuestas JSON estructuradas. No contienen lógica de negocio.
2.  **Services (Lógica de Negocio):** Centralizan las reglas operativas de la plataforma (ej. hashing de contraseñas, validaciones cruzadas).
3.  **Repositories (Acceso a Datos):** Capa de abstracción sobre el ORM (Eloquent). Aislan las consultas a la base de datos PostgreSQL.
4.  **Interfaces (Contratos):** Definen los métodos que los repositorios deben implementar, garantizando la inversión de dependencias.

## Funcionalidades Principales (Endpoints)

*   **Gestión de Usuarios (Alumnas):** Registro seguro con encriptación de contraseñas y control de vencimiento de planes.
*   **Niveles de Membresía:** Administración de los distintos planes de entrenamiento y sus costos.
*   **Catálogo de Ejercicios:** CRUD de ejercicios con enlaces a material audiovisual.
*   **Categorización Avanzada:** Sistema de etiquetas (muchos a muchos) para filtrar ejercicios (ej. "Cardio", "Tren Inferior").
*   **Ejercicios Favoritos:** Capacidad para que las alumnas guarden listas personalizadas de sus rutinas preferidas.
*   **Control de Pagos:** Registro de transacciones, métodos de pago y comprobantes asociados a cada alumna.
*   **Perfil Público:** Gestión de la biografía y enlaces de contacto de la entrenadora.

## Esquema de Base de Datos

El sistema implementa un modelo relacional normalizado en PostgreSQL con integridad referencial (llaves foráneas y borrado en cascada). Las entidades principales incluyen:
`usuario`, `nivel_membresia`, `ejercicio`, `categoria`, `pago`, `perfil_entrenadora`, y tablas pivot (`categoria_ejercicio`, `ejercicio_favorito`).
