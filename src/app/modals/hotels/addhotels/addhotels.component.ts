
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';

import { Hotels } from '../../../modelos/hotels';
import { HotelsService } from '../../../services/hotels.service';

@Component({
  selector: 'app-addhotels',
  standalone: false,
  templateUrl: './addhotels.component.html',
  styleUrl: './addhotels.component.css'
})
export class AddhotelsComponent implements OnInit {

  hotelsForm: FormGroup;
  hotels: Hotels = new Hotels();

  loading = false;

  // Propiedades para la imagen
  selectedImageName: string | null = null;
  imagePreview: string | null = null;
  imageError = '';

  private readonly MAX_IMAGE_SIZE = 400 * 1024;

  private readonly ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp'
  ];

  constructor(
    private fb: FormBuilder,
    private api: HotelsService,
    public dialogRef: MatDialogRef<AddhotelsComponent>,
    private router: Router
  ) {
    this.hotelsForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cityid: [null, Validators.required],
      rating: [
        null,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(5)
        ]
      ],
      ratesign: ['', Validators.required],
      images: ['', Validators.required],
      isActive: [true]
    });
  }

  ngOnInit(): void {}

  // Seleccionar y validar imagen
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    this.imageError = '';

    if (!file) {
      return;
    }

    // Validar formato
    if (!this.ALLOWED_IMAGE_TYPES.includes(file.type)) {
      this.imageError = 'Seleccione una imagen JPG, PNG o WebP.';
      input.value = '';
      return;
    }

    // Validar tamaño máximo: 400 KB
    if (file.size > this.MAX_IMAGE_SIZE) {
      this.imageError = 'La imagen no puede superar los 400 KB.';
      input.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result !== 'string') {
        this.imageError = 'No fue posible leer la imagen.';
        return;
      }

      this.imagePreview = result;
      this.selectedImageName = file.name;

      // Guardar la imagen codificada en el formulario
      this.hotelsForm.patchValue({
        images: result
      });

      this.hotelsForm.get('images')?.updateValueAndValidity();
    };

    reader.onerror = () => {
      this.imageError = 'Ocurrió un error al leer el archivo.';
      this.removeImage();
    };

    reader.readAsDataURL(file);
  }

  // Quitar la imagen seleccionada
  removeImage(): void {
    this.selectedImageName = null;
    this.imagePreview = null;
    this.imageError = '';

    this.hotelsForm.patchValue({
      images: ''
    });

    this.hotelsForm.get('images')?.updateValueAndValidity();

    const input = document.getElementById('images') as HTMLInputElement | null;

    if (input) {
      input.value = '';
    }
  }

  // Guardar hotel
  guardarHotels(): void {
    if (this.loading) {
      return;
    }

    if (this.hotelsForm.invalid) {
      this.hotelsForm.markAllAsTouched();

      Swal.fire({
        icon: 'warning',
        title: 'Formulario inválido',
        text: 'Completa todos los campos requeridos.',
        confirmButtonText: 'Aceptar'
      });

      return;
    }

    const formValue = this.hotelsForm.getRawValue();
    const cityId = Number(formValue.cityid);

    const hotel = {
      hotId: 0,
      hotName: String(formValue.nombre).trim(),
      hotDescription: String(formValue.descripcion).trim(),
      hotAddress: String(formValue.address).trim(),
      hotPhone: String(formValue.phone).trim(),
      hotEmail: String(formValue.email).trim(),
      hotCityId: cityId,
      hotRating: Number(formValue.rating),
      hotRateSign: String(formValue.ratesign).trim(),
      hotIsActive: Boolean(formValue.isActive),
      hotImages: String(formValue.images).trim(),
      city: {
        cityId: cityId,
        cityName: 'string',
        cityidDepartament: 1
      }
    };

    console.log('JSON enviado al backend:', hotel);

    this.loading = true;

    this.api.createHotels(hotel).subscribe({
      next: (response) => {
        console.log('Hotel creado:', response);

        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'El hotel se registró correctamente.',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.dialogRef.close(true);
        });
      },

      error: (error) => {
        console.error('Error al crear el hotel:', error.error);

        const mensaje = error.error?.errors
          ? Object.values(error.error.errors).flat().join('\n')
          : 'Hubo un problema al registrar el hotel.';

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
    const nombre = String(
      this.hotelsForm.get('nombre')?.value ?? ''
    ).trim();

    const descripcion = String(
      this.hotelsForm.get('descripcion')?.value ?? ''
    ).trim();

    const address = String(
      this.hotelsForm.get('address')?.value ?? ''
    ).trim();

    const phone = String(
      this.hotelsForm.get('phone')?.value ?? ''
    ).trim();

    const email = String(
      this.hotelsForm.get('email')?.value ?? ''
    ).trim();

    const cityid = Number(
      this.hotelsForm.get('cityid')?.value
    );

    const ratingValue = this.hotelsForm.get('rating')?.value;
    const rating = Number(ratingValue);

    const ratesign = String(
      this.hotelsForm.get('ratesign')?.value ?? ''
    ).trim();

    const images = String(
      this.hotelsForm.get('images')?.value ?? ''
    ).trim();

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nombre) {
      this.mostrarError('El nombre del hotel es obligatorio.');
      return;
    }

    if (!descripcion) {
      this.mostrarError('La descripción es obligatoria.');
      return;
    }

    if (!address) {
      this.mostrarError('La dirección es obligatoria.');
      return;
    }

    if (!phone) {
      this.mostrarError('El teléfono es obligatorio.');
      return;
    }

    if (!regexCorreo.test(email)) {
      this.mostrarError('Ingrese un correo electrónico válido.');
      return;
    }

    if (!Number.isInteger(cityid) || cityid <= 0) {
      this.mostrarError('Debe seleccionar una ciudad válida.');
      return;
    }

    if (
      ratingValue === null ||
      ratingValue === '' ||
      !Number.isFinite(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      this.mostrarError(
        'La calificación debe estar entre 1 y 5.'
      );
      return;
    }

    if (!ratesign) {
      this.mostrarError('El campo de tarifa es obligatorio.');
      return;
    }

    if (this.imageError || !images) {
      this.mostrarError(
        this.imageError || 'Debe seleccionar una imagen para el hotel.'
      );
      return;
    }

    this.guardarHotels();
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
