
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';

import { Roles } from '../../../modelos/roles';
import { RolesService } from '../../../services/roles.service';

@Component({
  selector: 'app-addroles',
  standalone: false,
  templateUrl: './addroles.component.html',
  styleUrl: './addroles.component.css'
})
export class AddrolesComponent implements OnInit {

  rolesForm: FormGroup;
  rol: Roles = new Roles();

  loading = false;

  constructor(
    private fb: FormBuilder,
    private api: RolesService,
    public dialogRef: MatDialogRef<AddrolesComponent>
  ) {

    this.rolesForm = this.fb.group({
      rolId: [0],
      rolName: ['', Validators.required],
      rolObservation: ['', Validators.required],
      rolIsActive: [true]
    });

  }

  ngOnInit(): void {
  }

  // Guardar nuevo rol
  guardarRoles(): void {

    if (this.loading) {
      return;
    }

    if (this.rolesForm.invalid) {
      this.rolesForm.markAllAsTouched();

      Swal.fire({
        icon: 'warning',
        title: 'Formulario inválido',
        text: 'Completa todos los campos requeridos.',
        confirmButtonText: 'Aceptar'
      });

      return;
    }

    const formValue = this.rolesForm.getRawValue();

    // Construir objeto según el modelo Roles
    const rol: Roles = {
      rolId: 0,
      rolName: String(formValue.rolName).trim(),
      rolObservation: String(formValue.rolObservation).trim(),
      rolIsActive: Boolean(formValue.rolIsActive)
    };

    console.log('JSON enviado al backend:', rol);

    this.loading = true;

    this.api.createRole(rol).subscribe({

      next: (response) => {
        console.log('Rol creado:', response);

        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'El rol se registró correctamente.',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.dialogRef.close(true);
        });
      },

      error: (error) => {
        console.error('Error al crear el rol:', error);

        const mensaje = error.error?.errors
          ? Object.values(error.error.errors).flat().join('\n')
          : error.error?.message
            || 'Hubo un problema al registrar el rol.';

        Swal.fire({
          icon: 'error',
          title: 'Error al guardar',
          text: mensaje,
          confirmButtonText: 'Aceptar'
        });
      },

      complete: () => {
        this.loading = false;
      }

    });

  }

  // Validaciones del formulario
  onSubmit(): void {

    if (this.rolesForm.invalid) {
      this.rolesForm.markAllAsTouched();

      Swal.fire({
        icon: 'warning',
        title: 'Formulario inválido',
        text: 'Completa todos los campos requeridos.',
        confirmButtonText: 'Aceptar'
      });

      return;
    }

    const nombre = String(
      this.rolesForm.get('rolName')?.value ?? ''
    ).trim();

    const observacion = String(
      this.rolesForm.get('rolObservation')?.value ?? ''
    ).trim();

    if (!nombre) {
      this.mostrarError('El nombre del rol es obligatorio.');
      return;
    }

    if (!observacion) {
      this.mostrarError('La observación del rol es obligatoria.');
      return;
    }

    this.guardarRoles();

  }

  private mostrarError(mensaje: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: mensaje,
      confirmButtonText: 'Aceptar'
    });
  }

  cerrarModal(): void {
    this.dialogRef.close();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
