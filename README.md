BackCheilGestHotels – Formas de navegación de la aplicación
La aplicación BackCheilGestHotels cuenta con dos interfaces de navegación, diseñadas según el tipo de usuario y sus permisos dentro del sistema.
1. Módulo de administración
Administradores
URL: http://localhost:4200/login

Esta es la ruta predeterminada de inicio de la aplicación. Cuando se ejecuta el proyecto Angular, el sistema redirige automáticamente a la pantalla de inicio de sesión.

Desde este módulo, los usuarios con roles de administrador pueden acceder al panel de gestión de hoteles, donde tienen disponibles las siguientes funcionalidades:
- Registrar nuevos hoteles.
- Consultar y listar hoteles registrados.
- Editar la información de los hoteles.
- Eliminar hoteles.
- Realizar búsquedas y filtros por nombre y calificación.
Los permisos de administración están disponibles para los roles 1 (Super Administrador) y 2 (Administrador).
2. Módulo de navegación para usuarios
Usuarios
URL: http://localhost:4200/inicio

Esta ruta corresponde a la página pública de navegación de la cadena hotelera. Está orientada a los usuarios que desean conocer los hoteles disponibles y consultar su información.

Desde esta interfaz se pueden realizar las siguientes acciones:
- Visualizar la presentación de la cadena hotelera.
- Consultar el listado de hoteles disponibles.
- Buscar hoteles por nombre.
- Filtrar hoteles por calificación.
- Consultar información e imágenes de los hoteles.
Los usuarios con rol 3 tienen acceso únicamente a las funcionalidades de consulta, sin permisos para crear, editar o eliminar hoteles.
3. Comportamiento de navegación según el rol
El sistema utiliza el rol asociado al usuario autenticado para determinar las funcionalidades disponibles y la navegación correspondiente.
Tipo de usuario	Rol	Acceso
Super Administrador	1	Administración CRUD
Administrador	2	Administración CRUD
Usuario	3	Navegación y consulta de hoteles

Comportamiento inicial: al ejecutar la aplicación, Angular utiliza /login como ruta predeterminada. Una vez autenticado, el usuario accede a las funcionalidades correspondientes a su rol. Los usuarios de consulta también pueden acceder directamente a /inicio.

Nota técnica: ambas interfaces pertenecen a la misma aplicación Angular y consumen el mismo backend REST desarrollado en .NET Core. La separación de funcionalidades se realiza mediante las rutas y los permisos asignados a cada rol.
