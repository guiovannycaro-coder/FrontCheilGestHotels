<<<<<<< HEAD
# FrontCheilGestHotels

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.4.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
=======
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
>>>>>>> cf6ad9e76de25bcce768f91e4af1166cfded35e1
