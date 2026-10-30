import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders,HttpParams} from '@angular/common/http';
import { BehaviorSubject, Observable , throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Country } from '../modelos/Country';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

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

    getCountryList(): Observable<any>{
              let direccion = this.baseUrl + "Country/ObtenerTodos";
              let response = this.http.get<any>(direccion,this.httpOptions);
              console.log(response);
              return response;
            }
          
             createCountry(usuarios: Country): Observable<any>{
              let direccion = this.baseUrl + "Country/InsertarCountry";
              let response = this.http.post<any>(direccion,usuarios,this.httpOptions);
          
              return response;
          
             }
          
            
             actualizarCountry(usuarios: Country): Observable<any>{
              let direccion = this.baseUrl + "Country/ActualizarCountryt";
              let response = this.http.post<any>(direccion,usuarios,this.httpOptions);
              console.log(response);
              return response;
            }
            
              eliminarCountry(data:any): Observable<any>{
          
              console.log("parametro a enviar " + data)
              let direccion = this.baseUrl + "Country/DeleteCountry?dato=" + data;
              let response = this.http.delete<any>(direccion);
              console.log(response);
              return response;
             }
          
              getCountryById(data:any): Observable<any>{
          
              console.log("parametro a enviar " + data)
              let direccion = this.baseUrl + "Country/ObtenerPorId?dato" + data;
              let response = this.http.get<any>(direccion);
              console.log(response);
              return response;
  }
  
}
