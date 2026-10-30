import { Component, OnInit } from '@angular/core';
import { HotelsService } from '../services/hotels.service';

@Component({
  selector: 'app-landinpage',
  standalone: false,
  templateUrl: './landinpage.component.html',
  styleUrls: ['./landinpage.component.css']
})
export class LandinpageComponent implements OnInit {

  hotels: any[] = [];
  hotName: string = '';
  hotRating: number | null = null;
  loading: boolean = false;

  constructor(private hotelsService: HotelsService) {}

  ngOnInit(): void {
    this.buscarHoteles();
  }

  buscarHoteles(): void {
    this.loading = true;

    this.hotelsService.buscarHotels(
      this.hotName,
      this.hotRating
    ).subscribe({
      next: (response: any) => {
        this.hotels = response.data || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error consultando hoteles:', error);
        this.hotels = [];
        this.loading = false;
      }
    });
  }

  limpiarBusqueda(): void {
    this.hotName = '';
    this.hotRating = null;
    this.buscarHoteles();
  }
}