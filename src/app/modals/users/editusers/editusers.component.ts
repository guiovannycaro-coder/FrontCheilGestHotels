import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';

import { Users } from '../../../modelos/users';
import { UsersService } from '../../../services/users.service';
import { DocumentType } from '../../../modelos/DocumentType';
import { DocumenttypepeService } from '../../../services/documenttype.service';

import { Roles } from '../../../modelos/roles';
import { RolesService } from '../../../services/roles.service';
@Component({
  selector: 'app-editusers',
  standalone: false,
  templateUrl: './editusers.component.html',
  styleUrl: './editusers.component.css'
})
export class EditusersComponent implements OnInit {

  usersForm: FormGroup;
  usuario: Users = new Users();
  listdoctype: DocumentType[] = [];
   listroles: Roles[] = [];
  loading = false;
  cargandoDatos = false;

  constructor(
    private fb: FormBuilder,
    private api: UsersService,
    private apidt: DocumenttypepeService,
     private apir:RolesService,
    public dialogRef: MatDialogRef<EditusersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { usuId: number }
  ) {

    this.usersForm = this.fb.group({
      usuId: [0],
      usuNames: ['', Validators.required],
      usuAddress: ['', Validators.required],
      usuPhone: ['', Validators.required],
      usuEmail: ['', [Validators.required, Validators.email]],
      usuDocumentId: ['', Validators.required],
      usuPassword: [''],
      usuTdocId: [null, [Validators.required, Validators.min(1)]],
      usuRolId: [null, Validators.required],
      usuIsActive: [true]
    });

  }

 ngOnInit(): void {

  console.log('Datos recibidos en el modal:', this.data);

  const id = Number(this.data?.usuId);

  if (!Number.isInteger(id) || id <= 0) {
    console.error('ID de usuario inválido:', this.data);
    this.mostrarError('No se recibió un ID de usuario válido.');
    this.dialogRef.close(false);
    return;
  }

   this.obtenerDocuemntType();
     this.obtenerRoles();
  this.obtenerUsuario(id);
}

  // Consultar usuario por ID
obtenerUsuario(id: number): void {

  this.cargandoDatos = true;

  this.api.getusuarioById(id).subscribe({

    next: (response) => {

      console.log('Respuesta completa:', response);

      // Obtener los datos de la respuesta
      let usuario = response.data;

      // Si el backend devuelve una lista, tomar el primer registro
      if (Array.isArray(usuario)) {
        usuario = usuario.length > 0 ? usuario[0] : null;
      }

      if (!usuario) {
        this.mostrarError('No se encontró el usuario.');
        return;
      }

      console.log('Usuario encontrado:', usuario);

      this.usuario = usuario;

      // Cargar datos en el formulario
      this.usersForm.patchValue({
        usuId: usuario.usuId,
        usuNames: usuario.usuNames,
        usuAddress: usuario.usuAddress,
        usuPhone: usuario.usuPhone,
        usuEmail: usuario.usuEmail,
        usuDocumentId: usuario.usuDocumentId,
        usuPassword: '',
        usuTdocId: Number(usuario.usuTdocId),
        usuRolId: Number(usuario.usuRolId),
        usuIsActive: usuario.usuIsActive
      });

      console.log('Formulario después de cargar:', this.usersForm.getRawValue());

    },

    error: (error) => {

      console.error('Error al consultar el usuario:', error);

      this.mostrarError(
        'No fue posible consultar la información del usuario.'
      );

      this.cargandoDatos = false;

    },

    complete: () => {
      this.cargandoDatos = false;
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


  
     private obtenerRoles(): void {
        
            this.apir.getRoleList().subscribe({
              next: (respuesta: any) => {
        
                console.log('Respuesta del backend:', respuesta);
          
                this.listroles = respuesta.data;
    
                console.log('Roles cargados:', this.listdoctype);
              },
              error: (error) => {
        
                console.error('Error al obtener Roles:', error);
        
                Swal.fire(
                  'Error',
                  'No se pudo obtener la lista de Roles.',
                  'error'
                );
              }
            });
  }
  
  // Actualizar usuario
 actualizarUsers(): void {

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

  const usuario: Users = {
    usuId: Number(formValue.usuId),
    usuNames: String(formValue.usuNames).trim(),
    usuAddress: String(formValue.usuAddress).trim(),
    usuPhone: String(formValue.usuPhone).trim(),
    usuEmail: String(formValue.usuEmail).trim(),
    usuDocumentId: String(formValue.usuDocumentId).trim(),
    usuPassword: String(formValue.usuPassword ?? ''),
    usuTdocId: Number(formValue.usuTdocId),
    usuRolId: Number(formValue.usuRolId),
    usuIsActive: Boolean(formValue.usuIsActive),
    documentType: {
      tipId: Number(formValue.usuTdocId),
      tipDescription: 'string',
      tipIsActive: true
    }
  };

  console.log('JSON enviado para actualizar:', usuario);

  this.loading = true;

  this.api.actualizarUsuarios(usuario).subscribe({

    next: (response) => {
      console.log('Usuario actualizado:', response);

      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'El usuario se actualizó correctamente.',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        this.dialogRef.close(true);
      });
    },

    error: (error) => {
      console.error('Error al actualizar el usuario:', error);

      const mensaje = error.error?.errors
        ? Object.values(error.error.errors).flat().join('\n')
        : error.error?.message
          || 'Hubo un problema al actualizar el usuario.';

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

    if (this.usersForm.invalid) {

      this.usersForm.markAllAsTouched();

      this.mostrarError('Completa todos los campos requeridos.');

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

    const tipoDocumento = Number(
      this.usersForm.get('usuTdocId')?.value
    );

    const rol = Number(
      this.usersForm.get('usuRolId')?.value
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

    if (!Number.isInteger(tipoDocumento) || tipoDocumento <= 0) {
      this.mostrarError('Debe seleccionar un tipo de documento válido.');
      return;
    }

    if (!Number.isInteger(rol) || rol <= 0) {
      this.mostrarError('Debe seleccionar un perfil válido.');
      return;
    }

    this.actualizarUsers();

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