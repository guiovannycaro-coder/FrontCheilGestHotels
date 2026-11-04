
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';

import { Users } from '../../modelos/users';
import { UsersService } from '../../services/users.service';
import { DocumenttypepeService } from '../../services/documenttype.service';
import { DocumentType } from '../../modelos/DocumentType';
@Component({
  selector: 'app-registrarse',
  standalone: false,
  templateUrl: './registrarse.component.html',
  styleUrl: './registrarse.component.css'
})
export class RegistrarseComponent implements OnInit {

  usersForm: FormGroup;
  usuario: Users = new Users();

    listdoctype: DocumentType[] =[];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private api: UsersService,
    private apidt:DocumenttypepeService,
    private location: Location
  ) {

    this.usersForm = this.fb.group({
      usuId: [0],
      usuNames: ['', Validators.required],
      usuAddress: ['', Validators.required],
      usuPhone: ['', Validators.required],
      usuEmail: ['', [Validators.required, Validators.email]],
      usuDocumentId: ['', Validators.required],
      usuPassword: ['', Validators.required],
      usuTdocId: [null, Validators.required],
      usuRolId: [3, Validators.required],
      usuIsActive: [true]
    });

  }

  ngOnInit(): void {
    this.obtenerDocuemntType();
  }

  // Registrar nuevo usuario
  guardarUsers(): void {

    if (this.loading) {
      return;
    }

    if (this.usersForm.invalid) {
      this.usersForm.markAllAsTouched();

      Swal.fire({
        icon: 'warning',
        title: 'Formulario inválido',
        text: 'Completa todos los campos requeridos.',
        confirmButtonText: 'Aceptar'
      });

      return;
    }

    const formValue = this.usersForm.getRawValue();

    const tipId = Number(formValue.usuTdocId);

    // Construir objeto según el modelo Users
    const usuario: Users = {
      usuId: 0,
      usuNames: String(formValue.usuNames).trim(),
      usuAddress: String(formValue.usuAddress).trim(),
      usuPhone: String(formValue.usuPhone).trim(),
      usuEmail: String(formValue.usuEmail).trim(),
      usuDocumentId: String(formValue.usuDocumentId).trim(),
      usuPassword: String(formValue.usuPassword),
      usuTdocId: tipId,
      usuRolId: 3,
      usuIsActive: Boolean(formValue.usuIsActive),

      documentType: {
        tipId: tipId,
        tipDescription: 'string',
        tipIsActive: true
      }
    };

    console.log('JSON enviado al backend:', usuario);

    this.loading = true;

    this.api.createUsuarios(usuario).subscribe({

      next: (response) => {

        console.log('Usuario creado:', response);

        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'El usuario se registró correctamente.',
          confirmButtonText: 'Aceptar'
        }).then(() => {

          // Regresar al componente anterior
          this.location.back();

        });

      },

      error: (error) => {

        console.error('Error al crear el usuario:', error);

        const mensaje = error.error?.errors
          ? Object.values(error.error.errors).flat().join('\n')
          : error.error?.message
            || 'Hubo un problema al registrar el usuario.';

        Swal.fire({
          icon: 'error',
          title: 'Error al guardar',
          text: mensaje,
          confirmButtonText: 'Aceptar'
        });

        this.loading = false;

      }

    });

  }



      private obtenerDocuemntType(): void {
    
        this.apidt.getDocumentTypeList().subscribe({
          next: (respuesta: any) => {
    
            console.log('Respuesta del backend:', respuesta);
      
            this.listdoctype = respuesta.data;

            console.log('DocumentTypes cargados:', this.listdoctype);
          },
          error: (error) => {
    
            console.error('Error al obtener DocumentTypes:', error);
    
            Swal.fire(
              'Error',
              'No se pudo obtener la lista de DocumentTypes.',
              'error'
            );
          }
        });
      }

  // Validaciones del formulario
  onSubmit(): void {

    if (this.loading) {
      return;
    }

    if (this.usersForm.invalid) {
      this.usersForm.markAllAsTouched();

      Swal.fire({
        icon: 'warning',
        title: 'Formulario inválido',
        text: 'Completa todos los campos requeridos.',
        confirmButtonText: 'Aceptar'
      });

      return;
    }

    const nombre = String(
      this.usersForm.get('usuNames')?.value ?? ''
    ).trim();

    const direccion = String(
      this.usersForm.get('usuAddress')?.value ?? ''
    ).trim();

    const telefono = String(
      this.usersForm.get('usuPhone')?.value ?? ''
    ).trim();

    const email = String(
      this.usersForm.get('usuEmail')?.value ?? ''
    ).trim();

    const documento = String(
      this.usersForm.get('usuDocumentId')?.value ?? ''
    ).trim();

    const password = String(
      this.usersForm.get('usuPassword')?.value ?? ''
    );

    const tipoDocumento = Number(
      this.usersForm.get('usuTdocId')?.value
    );

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nombre) {
      this.mostrarError('El nombre del usuario es obligatorio.');
      return;
    }

    if (!direccion) {
      this.mostrarError('La dirección es obligatoria.');
      return;
    }

    if (!telefono) {
      this.mostrarError('El teléfono es obligatorio.');
      return;
    }

    if (!regexCorreo.test(email)) {
      this.mostrarError('Ingrese un correo electrónico válido.');
      return;
    }

    if (!documento) {
      this.mostrarError('El número de documento es obligatorio.');
      return;
    }

    if (!password.trim()) {
      this.mostrarError('La contraseña es obligatoria.');
      return;
    }

    if (!Number.isInteger(tipoDocumento) || tipoDocumento <= 0) {
      this.mostrarError('Debe seleccionar un tipo de documento válido.');
      return;
    }

    // El rol Cliente está definido con ID = 3
    this.guardarUsers();

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

