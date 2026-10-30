
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

import { Roles } from '../../modelos/roles';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  perusu: Roles[] = [];
  perusud: Roles = new Roles();
  usuario: string | null = null;
rolId: number = 0;
  private readonly esNavegador: boolean;

  constructor(
    private api: UsersService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.esNavegador = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (!this.esNavegador) {
      return;
    }
    this.rolId = Number(sessionStorage.getItem('perfilUsuario'));
    
    console.log( "rol del sistema " + this.rolId)
    this.usuario = sessionStorage.getItem('email')
      ?? localStorage.getItem('email');

    if (this.usuario) {
      this.obtenerPerfilUsuario(this.usuario);
    }
  }

  private obtenerPerfilUsuario(usuario: string): void {
    this.api.getUsuarioPerfil(usuario).subscribe({
      next: (respuesta: any) => {
        // Si el backend devuelve { codeError, message, data }
        this.perusud = respuesta?.data ?? respuesta;

        console.log('Perfil del usuario:', this.perusud);
      },
      error: (error) => {
        console.error('Error al obtener el perfil del usuario:', error);
      }
    });
  }

logout(): void {
  const rol = Number(sessionStorage.getItem('perfilUsuario'));

  console.log('Rol antes de cerrar sesión:', rol);

  // Limpiar sesión
  sessionStorage.removeItem('email');
  sessionStorage.removeItem('perfilUsuario');
  localStorage.removeItem('email');

  if (rol === 3) {
    this.router.navigate(['/inicio']);
  } else {
    this.router.navigate(['/login']);
  }
}
  getRolName(rol: number | null | undefined): string {
    switch (rol) {
      case 1:
        return 'Super Administrador';
      case 2:
        return 'Administrador';
      default:
        return 'Usuario';
    }
  }
}