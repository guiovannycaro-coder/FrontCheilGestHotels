import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders,HttpParams} from '@angular/common/http';
import { BehaviorSubject, Observable , throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Hotels } from '../modelos/hotels';

@Injectable({
  providedIn: 'root'
})
export class HotelsService {

     private readonly baseUrl = 'https://localhost:7170/api/gestHotel/';
   
  id: number;

constructor(private http: HttpClient) {
    this.id =0;
  }

  httpOptions = {
   headers: new HttpHeaders({
     'Content-Type': 'application/json'
   })
  }

  getHotelsList(): Observable<any>{
     
    let direccion = this.baseUrl + "Hotels/ObtenerTodos";
    console.log(direccion);
        let response = this.http.get<any>(direccion,this.httpOptions);
        console.log(response);
        return response;
      }
    
       createHotels(usuarios: Hotels): Observable<any>{
         let direccion = this.baseUrl + "Hotels/InsertarHotels";
         console.log("direccion hotel url " + direccion);
        let response = this.http.post<any>(direccion,usuarios,this.httpOptions);
     console.log("respuesta hotel url " + response);
        return response;
    
       }
    
      
      actualizarHotels(hotel: Hotels): Observable<any> {
  const direccion =
    `${this.baseUrl}Hotels/ActualizarHotels?hotId=${hotel.hotId}`;

  console.log('URL de actualización:', direccion);
  console.log('Hotel enviado:', JSON.stringify(hotel, null, 2));

  return this.http.put<any>(
    direccion,
    hotel,
    this.httpOptions
  );
}
      
        eliminarHotels(data:any): Observable<any>{
    
        console.log("parametro a enviar " + data)
        let direccion = this.baseUrl + "Hotels/DeleteHotels?dato=" + data;
        let response = this.http.delete<any>(direccion);
        console.log(response);
        return response;
       }
    
        getHotelsById(data:any): Observable<any>{
    
        console.log("parametro a enviar " + data)
        let direccion = this.baseUrl + "Hotels/ObtenerPorId?dato=" + data;
        let response = this.http.get<any>(direccion);
        console.log(response);
        return response;
  }
  
buscarHotels(hotName: string, hotRating: number | null): Observable<any> {

  console.log('Nombre del hotel:', hotName);
  console.log('Puntuación del hotel:', hotRating);



  let direccion = this.baseUrl + 'Hotels/BuscarHotels?hotName='
    + encodeURIComponent(hotName)
    + '&hotRating='
    + (hotRating !== null ? hotRating : '');

  console.log('URL de consulta:', direccion);

  return this.http.get<any>(direccion);
}
}
