
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';

import { Hotels } from '../../../modelos/hotels';
import { HotelsService } from '../../../services/hotels.service';

@Component({
  selector: 'app-busavanzada-uno',
  standalone: false,
  templateUrl: './busavanzada-uno.component.html',
  styleUrl: './busavanzada-uno.component.css'
})
export class BusavanzadaUnoComponent implements OnInit {

  // 1. FORMULARIO: únicamente contiene los filtros de búsqueda
  searchForm: FormGroup;

  // 2. RESPUESTA DEL BACKEND: hoteles que se mostrarán en la tabla
  hotels: Hotels[] = [];

  // 3. ESTADOS DE LA CONSULTA
  loading = false;
  searched = false;

  constructor(
    private fb: FormBuilder,
    private api: HotelsService,
    public dialogRef: MatDialogRef<BusavanzadaUnoComponent>
  ) {
    this.searchForm = this.fb.group({
      nombre: [''],
      rating: [null]
    });
  }

  ngOnInit(): void {}

  // 4. BUSCAR HOTELES EN EL BACKEND
  buscar(): void {

    const hotName: string =
      (this.searchForm.get('nombre')?.value ?? '').trim();

    const ratingValue = this.searchForm.get('rating')?.value;

    const hotRating: number | null =
      ratingValue === '' || ratingValue === null
        ? null
        : Number(ratingValue);

    this.loading = true;
    this.searched = true;
    this.hotels = [];

    this.api.buscarHotels(hotName, hotRating).subscribe({

      next: (response: any) => {

        console.log('Respuesta del backend:', response);

        // La API devuelve los resultados dentro de "data"
        if (Array.isArray(response?.data)) {
          this.hotels = response.data;
        } else {
          this.hotels = [];
        }

        this.loading = false;

        if (this.hotels.length === 0) {
          Swal.fire({
            icon: 'info',
            title: 'Sin resultados',
            text: 'No se encontraron hoteles con los filtros indicados.'
          });
        }
      },

      error: (error) => {

        console.error('Error al buscar hoteles:', error);

        this.loading = false;

        Swal.fire({
          icon: 'error',
          title: 'Error en la búsqueda',
          text: 'No fue posible consultar los hoteles.'
        });
      }
    });
  }

  // 5. LIMPIAR FILTROS Y RESULTADOS
  limpiar(): void {

    this.searchForm.reset({
      nombre: '',
      rating: null
    });

    this.hotels = [];
    this.searched = false;
  }

  // 6. CERRAR EL MODAL
  cerrarModal(): void {
    this.dialogRef.close();
  }

  // 7. DEVOLVER EL HOTEL SELECCIONADO AL COMPONENTE PADRE
  seleccionarHotel(hotel: Hotels): void {
    this.dialogRef.close(hotel);
  }
}
