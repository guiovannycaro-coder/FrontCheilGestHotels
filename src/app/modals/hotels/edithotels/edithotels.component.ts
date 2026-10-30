
import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import Swal from 'sweetalert2';

import { Hotels } from '../../../modelos/hotels';
import { HotelsService } from '../../../services/hotels.service';

@Component({
  selector: 'app-edithotels',
  standalone: false,
  templateUrl: './edithotels.component.html',
  styleUrl: './edithotels.component.css'
})
export class EdithotelsComponent implements OnInit {

  hotelsForm: FormGroup;
  hotelsar: Hotels[] = [];

  loading = true;
  saving = false;
  errorCarga = false;

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
    public dialogRef: MatDialogRef<EdithotelsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { hotId: number }
  ) {

    this.hotelsForm = this.fb.group({
      hotId: [null, Validators.required],
      hotName: ['', Validators.required],
      hotDescription: ['', Validators.required],
      hotAddress: ['', Validators.required],
      hotPhone: ['', Validators.required],
      hotEmail: ['', [Validators.required, Validators.email]],
      hotCityId: [null, [Validators.required, Validators.min(1)]],
      hotRating: [
        null,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(5)
        ]
      ],
      hotRateSign: ['', Validators.required],
      hotImages: ['', Validators.required],
      hotIsActive: [true]
    });

  }

  ngOnInit(): void {
    this.obtHotelsById(this.data.hotId);
  }

  // CONSULTAR HOTEL POR ID
  obtHotelsById(id: number): void {

    this.loading = true;
    this.errorCarga = false;

    this.api.getHotelsById(id).subscribe({

      next: (response: any) => {

        console.log('Respuesta de la API:', response);

        const hotel: Hotels | undefined =
          response?.codeError === 0 &&
          Array.isArray(response.data)
            ? response.data[0]
            : undefined;

        if (hotel) {

          this.hotelsar = [hotel];

          this.hotelsForm.patchValue({
            hotId: hotel.hotId,
            hotName: hotel.hotName,
            hotDescription: hotel.hotDescription,
            hotAddress: hotel.hotAddress,
            hotPhone: hotel.hotPhone,
            hotEmail: hotel.hotEmail,
            hotCityId: Number(hotel.hotCityId),
            hotRating: Number(hotel.hotRating),
            hotRateSign: hotel.hotRateSign,
            hotImages: hotel.hotImages,
            hotIsActive: hotel.hotIsActive
          });

          // Cargar imagen existente
          this.loadCurrentImage(hotel.hotImages);

          console.log(
            'Formulario cargado:',
            this.hotelsForm.getRawValue()
          );

        } else {

          this.hotelsar = [];
          this.errorCarga = true;

        }

        this.loading = false;

      },

      error: (error) => {

        console.error('Error al consultar el hotel:', error);

        this.hotelsar = [];
        this.errorCarga = true;
        this.loading = false;

        this.mostrarError(
          'No fue posible cargar la información del hotel.'
        );

      }

    });

  }

  // CARGAR IMAGEN ACTUAL DEL HOTEL
  private loadCurrentImage(image: string | null | undefined): void {

    this.imageError = '';
    this.imagePreview = null;
    this.selectedImageName = null;

    if (!image) {
      return;
    }

    // Si ya es Base64, mostrar directamente
    if (image.startsWith('data:image/')) {

      this.imagePreview = image;
      this.selectedImageName = 'Imagen actual';

    } else {

      // Si es solamente el nombre o ruta del archivo
      this.selectedImageName = image;

    }

  }

  // SELECCIONAR Y VALIDAR NUEVA IMAGEN
  onImageSelected(event: Event): void {

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    this.imageError = '';

    if (!file) {
      return;
    }

    // Validar formato
    if (!this.ALLOWED_IMAGE_TYPES.includes(file.type)) {

      this.imageError =
        'Seleccione una imagen JPG, PNG o WebP.';

      input.value = '';
      return;

    }

    // Validar tamaño máximo de 400 KB
    if (file.size > this.MAX_IMAGE_SIZE) {

      this.imageError =
        'La imagen no puede superar los 400 KB.';

      input.value = '';
      return;

    }

    const reader = new FileReader();

    reader.onload = () => {

      const result = reader.result;

      if (typeof result !== 'string') {

        this.imageError =
          'No fue posible leer la imagen.';

        return;

      }

      this.imagePreview = result;
      this.selectedImageName = file.name;

      // Actualizar imagen en el formulario
      this.hotelsForm.patchValue({
        hotImages: result
      });

      this.hotelsForm.get('hotImages')?.updateValueAndValidity();

      console.log('Nueva imagen seleccionada:', file.name);

    };

    reader.onerror = () => {

      this.imageError =
        'Ocurrió un error al leer la imagen.';

    };

    reader.readAsDataURL(file);

  }

  // QUITAR IMAGEN
  removeImage(): void {

    this.selectedImageName = null;
    this.imagePreview = null;
    this.imageError = '';

    this.hotelsForm.patchValue({
      hotImages: ''
    });

    this.hotelsForm.get('hotImages')?.updateValueAndValidity();

    const input = document.getElementById('images') as HTMLInputElement | null;

    if (input) {
      input.value = '';
    }

  }

  // ACTUALIZAR HOTEL
  onSubmit(): void {

    if (this.saving || this.loading) {
      return;
    }

    if (this.hotelsForm.invalid) {

      this.hotelsForm.markAllAsTouched();

      this.mostrarError(
        'Verifica los campos obligatorios del formulario.'
      );

      return;

    }

    if (this.imageError) {

      this.mostrarError(this.imageError);
      return;

    }

    const valores = this.hotelsForm.getRawValue();

    const hotelId = Number(valores.hotId);
    const cityId = Number(valores.hotCityId);
    const rating = Number(valores.hotRating);

    if (!Number.isInteger(hotelId) || hotelId <= 0) {

      this.mostrarError(
        'No se encontró un ID válido para el hotel.'
      );

      return;

    }

    if (!Number.isInteger(cityId) || cityId <= 0) {

      this.mostrarError(
        'Debes seleccionar una ciudad válida.'
      );

      return;

    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {

      this.mostrarError(
        'La calificación debe ser un número entero entre 1 y 5.'
      );

      return;

    }

    const ciudadActual = (this.hotelsar[0] as any)?.city;

    const hotelActualizar = {

      hotId: hotelId,
      hotName: String(valores.hotName).trim(),
      hotDescription: String(valores.hotDescription).trim(),
      hotAddress: String(valores.hotAddress).trim(),
      hotPhone: String(valores.hotPhone).trim(),
      hotEmail: String(valores.hotEmail).trim(),
      hotCityId: cityId,
      hotRating: rating,
      hotRateSign: String(valores.hotRateSign).trim(),
      hotIsActive: Boolean(valores.hotIsActive),

      // Mantiene la imagen actual o envía la nueva imagen Base64
      hotImages: String(valores.hotImages).trim(),

      city: {
        cityId: cityId,
        cityName: ciudadActual?.cityName ?? '',
        cityidDepartament: Number(
          ciudadActual?.cityidDepartament ?? 0
        )
      }

    };

    console.log(
      'Objeto enviado para actualizar:',
      hotelActualizar
    );

    this.saving = true;

    this.api.actualizarHotels(hotelActualizar as Hotels).subscribe({

      next: (response: any) => {

        console.log('Respuesta al actualizar:', response);

        this.saving = false;

        if (
          response?.codeError !== undefined &&
          response.codeError !== 0
        ) {

          this.mostrarError(
            response.message ||
            'No se pudo actualizar el hotel.'
          );

          return;

        }

        Swal.fire({

          icon: 'success',
          title: 'Éxito',
          text: response?.message ||
            'El hotel se actualizó correctamente.',
          confirmButtonText: 'Aceptar'

        }).then(() => {

          this.dialogRef.close(true);

        });

      },

      error: (error) => {

        console.error('Error al actualizar el hotel:', error);
        console.error('Estado HTTP:', error.status);
        console.error('Respuesta del servidor:', error.error);

        this.saving = false;

        const errores = error?.error?.errors;

        let mensaje =
          error?.error?.title ||
          error?.error?.message ||
          'No fue posible actualizar el hotel.';

        if (errores) {

          const detalles = Object.entries(errores)
            .map(([campo, mensajes]) => {

              const detalle = Array.isArray(mensajes)
                ? mensajes.join(', ')
                : String(mensajes);

              return `${campo}: ${detalle}`;

            });

          mensaje = detalles.join('\n');

        }

        this.mostrarError(mensaje);

      }

    });

  }

  // CERRAR MODAL
  closeDialog(): void {
    this.dialogRef.close(false);
  }

  // MOSTRAR MENSAJES
  private mostrarError(mensaje: string): void {

    Swal.fire({

      icon: 'error',
      title: 'Error',
      text: mensaje,
      confirmButtonText: 'Aceptar'

    });

  }

}

