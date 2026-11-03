
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';

import { Roles } from '../../../modelos/roles';
import { RolesService } from '../../../services/roles.service';

@Component({
  selector: 'app-editroles',
  standalone: false,
  templateUrl: './editroles.component.html',
  styleUrl: './editroles.component.css'
})
export class EditrolesComponent implements OnInit {

  rolesForm: FormGroup;
  rol: Roles = new Roles();

  loading = false;
  cargandoDatos = false;

  constructor(
    private fb: FormBuilder,
    private api: RolesService,
    public dialogRef: MatDialogRef<EditrolesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { rolId: number }
  ) {

    this.rolesForm = this.fb.group({
      rolId: [0],
      rolName: ['', Validators.required],
      rolObservation: ['', Validators.required],
      rolIsActive: [true]
    });

  }

  ngOnInit(): void {

    console.log('Datos recibidos en el modal:', this.data);

    const id = Number(this.data?.rolId);

    if (!Number.isInteger(id) || id <= 0) {
      console.error('ID de rol inválido:', this.data);
      this.mostrarError('No se recibió un ID de rol válido.');
      this.dialogRef.close(false);
      return;
    }

    this.obtenerRol(id);
  }

  // Consultar rol por ID
  obtenerRol(id: number): void {

    this.cargandoDatos = true;

    this.api.getRoleById(id).subscribe({

      next: (response) => {

        console.log('Respuesta completa:', response);

        // Obtener los datos de la respuesta
        let rol = response.data;

        // Si el backend devuelve una lista, tomar el primer registro
        if (Array.isArray(rol)) {
          rol = rol.length > 0 ? rol[0] : null;
        }

        if (!rol) {
          this.mostrarError('No se encontró el rol.');
          this.dialogRef.close(false);
          return;
        }

        console.log('Rol encontrado:', rol);

        this.rol = rol;

        // Cargar datos en el formulario
        this.rolesForm.patchValue({
          rolId: rol.rolId,
          rolName: rol.rolName,
          rolObservation: rol.rolObservation,
          rolIsActive: rol.rolIsActive
        });

        console.log(
          'Formulario después de cargar:',
          this.rolesForm.getRawValue()
        );

      },

      error: (error) => {

        console.error('Error al consultar el rol:', error);

        this.mostrarError(
          'No fue posible consultar la información del rol.'
        );

        this.cargandoDatos = false;

      },

      complete: () => {
        this.cargandoDatos = false;
      }

    });
  }

  // Actualizar rol
  actualizarRoles(): void {

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
      rolId: Number(formValue.rolId),
      rolName: String(formValue.rolName).trim(),
      rolObservation: String(formValue.rolObservation).trim(),
      rolIsActive: Boolean(formValue.rolIsActive)
    };

    console.log('JSON enviado para actualizar:', rol);

    this.loading = true;

    this.api.actualizarRole(rol).subscribe({

      next: (response) => {

        console.log('Rol actualizado:', response);

        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'El rol se actualizó correctamente.',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.dialogRef.close(true);
        });

      },

      error: (error) => {

        console.error('Error al actualizar el rol:', error);

        const mensaje = error.error?.errors
          ? Object.values(error.error.errors).flat().join('\n')
          : error.error?.message
            || 'Hubo un problema al actualizar el rol.';

        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar',
          text: mensaje,
          confirmButtonText: 'Aceptar'
        });

        this.loading = false;

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

      this.mostrarError('Completa todos los campos requeridos.');

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

    this.actualizarRoles();

  }

  // Mostrar mensajes de error
  private mostrarError(mensaje: string): void {

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: mensaje,
      confirmButtonText: 'Aceptar'
    });

  }

  // Cerrar modal
  cerrarModal(): void {
    this.dialogRef.close();
  }

}
