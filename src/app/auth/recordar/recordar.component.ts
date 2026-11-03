
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';

import { Login } from '../../modelos/login';
import { SeguridadService } from '../../services/seguridad.service';

@Component({
  selector: 'app-recordar',
  standalone: false,
  templateUrl: './recordar.component.html',
  styleUrl: './recordar.component.css'
})
export class RecordarComponent implements OnInit {

  recordarForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private api: SeguridadService,
    private location: Location
  ) {

    this.recordarForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      clave: ['', Validators.required]
    });

  }

  ngOnInit(): void {
  }

  // Solicitar recuperación de contraseña
  recordarPassword(): void {

    if (this.loading) {
      return;
    }

    if (this.recordarForm.invalid) {

      this.recordarForm.markAllAsTouched();

      Swal.fire({
        icon: 'warning',
        title: 'Formulario inválido',
        text: 'Ingrese un correo electrónico válido y una contraseña.',
        confirmButtonText: 'Aceptar'
      });

      return;
    }

    const email = String(
      this.recordarForm.get('email')?.value ?? ''
    ).trim();

    const clave = String(
      this.recordarForm.get('clave')?.value ?? ''
    );

    if (!email) {
      this.mostrarError('El correo electrónico es obligatorio.');
      return;
    }

    if (!clave.trim()) {
      this.mostrarError('La contraseña es obligatoria.');
      return;
    }

    // Construir objeto según el modelo Login
    const login: Login = {
      email: email,
      password: clave
    };

    console.log('Solicitud de recuperación:', {
      email: login.email
    });

    this.loading = true;

    this.api.rememberUser(login).subscribe({

      next: (response) => {

        console.log('Respuesta del backend:', response);

        Swal.fire({
          icon: 'success',
          title: 'Solicitud procesada',
          text: response.message || 'La contraseña fue actualizada correctamente.',
          confirmButtonText: 'Aceptar'
        }).then(() => {

          this.location.back();

        });

      },

      error: (error) => {

        console.error('Error al solicitar recuperación:', error);

        const mensaje = error.error?.message
          || 'No fue posible procesar la solicitud de recuperación.';

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: mensaje,
          confirmButtonText: 'Aceptar'
        });

        this.loading = false;

      }

    });

  }

  // Mostrar mensajes de validación
  private mostrarError(mensaje: string): void {

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: mensaje,
      confirmButtonText: 'Aceptar'
    });

  }

  // Cancelar y regresar al componente anterior
  cancelar(): void {
    this.location.back();
  }

}

