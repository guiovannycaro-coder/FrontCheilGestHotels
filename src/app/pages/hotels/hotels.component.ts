
import { AfterViewInit, Component, OnInit, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { isPlatformBrowser } from '@angular/common';

import Swal from 'sweetalert2';

import { Hotels } from '../../modelos/hotels';
import { Roles } from '../../modelos/roles';

import { HotelsService } from '../../services/hotels.service';
import { UsersService } from '../../services/users.service';
import { SeguridadService } from '../../services/seguridad.service';

import { AddhotelsComponent } from '../../modals/hotels/addhotels/addhotels.component';
import { EdithotelsComponent } from '../../modals/hotels/edithotels/edithotels.component';
import { BusavanzadaUnoComponent } from '../../modals/busquedas/busavanzada-uno/busavanzada-uno.component';

@Component({
  selector: 'app-hotels',
  standalone: false,
  templateUrl: './hotels.component.html',
  styleUrl: './hotels.component.css'
})
export class HotelsComponent implements OnInit, AfterViewInit {

  // Columnas generales: visibles para todos los roles.
  displayedColumns: string[] = [
    'id',
    'Nombre',
    'Descripcion',
    'Direccion',
    'Telefono',
    'Correo',
    'Ciudad',
    'rating',
    'ratesign',
    'Imagen',
    'Estado'
  ];

  dataSource = new MatTableDataSource<Hotels>();

  perusu: Roles[] = [];
  perusud: Roles = new Roles();

  usuario: string | null = null;
  perfil: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private apiu: UsersService,
    private apis: SeguridadService,
    private api: HotelsService,
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

    this.obtenerHotels();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // Agrega la columna Acciones únicamente para los roles 1 y 2.
  get displayedColumnsFinal(): string[] {
    return this.esPermitidoAdmin()
      ? [...this.displayedColumns, 'Acciones']
      : this.displayedColumns;
  }

  // Obtener perfil del usuario.
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

  // Obtener rol del usuario.
  private obtenerDatosUsuario(usuario: string): void {
    this.apiu.getUsuarioPerfil(usuario).subscribe({
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

  // Consultar todos los hoteles.
  private obtenerHotels(): void {

    this.api.getHotelsList().subscribe({
      next: (respuesta: any) => {

        console.log('Respuesta del backend:', respuesta);

        const hoteles: Hotels[] = respuesta.data ?? [];

        this.dataSource.data = hoteles;

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

  // Abrir formulario para agregar hotel.
  openAddProForm(): void {

    if (!this.esPermitidoAdmin()) {
      return;
    }

    this.dialog.open(AddhotelsComponent, {
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

    this.dialog.open(EdithotelsComponent, {
      data: { hotId: id },
      width: '500px'
    });
  }

  // Búsqueda avanzada disponible para todos los roles.
  openSearchNameScore(): void {

    this.dialog.open(BusavanzadaUnoComponent, {
      width: '95vw',
      maxWidth: '1800px',
      maxHeight: '90vh',
      autoFocus: false
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

        this.api.eliminarHotels(id).subscribe({
          next: (data) => {

            console.log('Hotel eliminado:', data);

            Swal.fire(
              '¡Eliminado!',
              'El hotel ha sido eliminado.',
              'success'
            );

            // Actualizar tabla sin recargar toda la página.
            this.obtenerHotels();
          },
          error: (error) => {

            console.error('Error al eliminar el hotel:', error);

            Swal.fire(
              'Error',
              'No se pudo eliminar el hotel.',
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
