
import { AfterViewInit, Component, OnInit, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { isPlatformBrowser } from '@angular/common';

import Swal from 'sweetalert2';
import { Users } from '../../modelos/users';
import { Roles } from '../../modelos/roles';


import { UsersService } from '../../services/users.service';
import { SeguridadService } from '../../services/seguridad.service';
import { AddusersComponent } from '../../modals/users/addusers/addusers.component';
import { EditusersComponent } from '../../modals/users/editusers/editusers.component';

@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit, AfterViewInit{
    // Columnas generales: visibles para todos los roles.
 displayedColumns: string[] = [
  'Id',
  'Nombres',
  'Direccion',
  'Telefono',
  'Correo',
  'Documento',
  'TipoDoc',
  'Perfil',
  'Estado'
];

  dataSource = new MatTableDataSource<Users>();
  
    perusu: Roles[] = [];
  perusud: Roles = new Roles();
  usuario: string | null = null;
  perfil: string = '';
  
    @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
    constructor(
      private api: UsersService,
      private apis: SeguridadService,
      @Inject(MatDialog) public dialog: MatDialog,
      @Inject(PLATFORM_ID) private platformId: object
    ) {}
  
    ngOnInit(): void {
  
      this.usuario = sessionStorage.getItem('email')
        ?? localStorage.getItem('email');
  
      if (this.usuario) {
        this.obtenerDatosUsuario(this.usuario);
        this.obtenerPerfilUsuario(this.usuario);
      }
  
      this.obtenerUsuarios();
    }
  
   ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

   get displayedColumnsFinal(): string[] {
    return this.esPermitidoAdmin()
      ? [...this.displayedColumns, 'Acciones']
      : this.displayedColumns;
  }

    private obtenerPerfilUsuario(usuario: string): void {
    this.apis.getProfile(usuario).subscribe({
      next: (data) => {
        this.perfil = String(data.perfil);
      },
      error: (error) => {
        console.error('Error al obtener el perfil:', error);
      }
    });
  }

   private obtenerDatosUsuario(usuario: string): void {
    this.api.getUsuarioPerfil(usuario).subscribe({
      next: (respuesta) => {

        this.perusud = respuesta.data;

        this.perusu = this.perusud
          ? [this.perusud]
          : [];

        console.log('Rol recibido:', this.perusud?.rolId);
        console.log('Nombre del rol:', this.perusud?.rolName);
        console.log('¿Es administrador?', this.esPermitidoAdmin());
      },
      error: (error) => {
        console.error('Error al obtener el rol del usuario:', error);
      }
    });
  }


  // Verificar si el usuario puede administrar hoteles.
  // Roles 1 y 2.
  esPermitidoAdmin(): boolean {
    const rolId = Number(this.perusud?.rolId);

    return rolId === 1 || rolId === 2;
  }

  // Verificar si el usuario solamente puede consultar.
  // Rol 3.
  esUsuarioConsulta(): boolean {
    return Number(this.perusud?.rolId) === 3;
  }

  // Nombre del rol.
  getRolName(rol: number | null | undefined): string {
    switch (Number(rol)) {
      case 1:
        return 'Super Administrador';

      case 2:
        return 'Administrador';

      case 3:
        return 'Usuario';

      default:
        return 'Sin rol asignado';
    }
  }

    private obtenerUsuarios(): void {
  
      this.api.getUsuariosList().subscribe({
        next: (respuesta: any) => {
  
          console.log('Respuesta del backend:', respuesta);
  
          const usuarios: Users[] = respuesta.data ?? [];
  
          this.dataSource.data = usuarios;
  
          if (this.paginator) {
            this.dataSource.paginator = this.paginator;
          }
  
          if (this.sort) {
            this.dataSource.sort = this.sort;
          }
  
          console.log('Hoteles cargados:', this.dataSource.data);
        },
        error: (error) => {
  
          console.error('Error al obtener hoteles:', error);
  
          Swal.fire(
            'Error',
            'No se pudo obtener la lista de hoteles.',
            'error'
          );
        }
      });
    }

    openAddProForm(): void {
  
      if (!this.esPermitidoAdmin()) {
        return;
      }
  
      this.dialog.open(AddusersComponent, {
        width: '500px'
      });
    }
  
    // Abrir formulario para editar hotel.
     openEditProForm(id: number): void {
   
       if (!this.esPermitidoAdmin()) {
         return;
       }
   
       if (!id) {
         console.error('Error: el ID del hotel es inválido.');
         return;
       }
   
       this.dialog.open(EditusersComponent, {
         data: { hotId: id },
         width: '500px'
       });
     }

  // Eliminar hotel: solamente roles 1 y 2.
    openDropProForm(id: number): void {
  
      if (!this.esPermitidoAdmin()) {
        return;
      }
  
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'No podrás revertir esta acción',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
  
        if (result.isConfirmed) {
  
          this.api.eliminarusuario(id).subscribe({
            next: (data) => {
  
              console.log('Hotel eliminado:', data);
  
              Swal.fire(
                '¡Eliminado!',
                'El usuario ha sido eliminado.',
                'success'
              );
  
              // Actualizar tabla sin recargar toda la página.
              this.obtenerUsuarios();
            },
            error: (error) => {
  
              console.error('Error al eliminar el usuario:', error);
  
              Swal.fire(
                'Error',
                'No se pudo eliminar el usuario.',
                'error'
              );
            }
          });
        }
      });
    }
  
    // Filtro general de la tabla.
    applyFilter(event: Event): void {
  
      const filterValue = (event.target as HTMLInputElement).value;
  
      this.dataSource.filter = filterValue.trim().toLowerCase();
  
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }

}
