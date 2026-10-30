import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders,HttpParams} from '@angular/common/http';
import { BehaviorSubject, Observable , throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';

import { City } from '../modelos/city';

@Injectable({
  providedIn: 'root'
})
export class CityService {

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

    getCityList(): Observable<any>{
                let direccion = this.baseUrl + "City/ObtenerTodos";
                let response = this.http.get<any>(direccion,this.httpOptions);
                console.log(response);
                return response;
              }
            
               createCity(usuarios: City): Observable<any>{
                let direccion = this.baseUrl + "City/InsertarCity";
                let response = this.http.post<any>(direccion,usuarios,this.httpOptions);
            
                return response;
            
               }
            
              
               actualizarCity(usuarios: City): Observable<any>{
                let direccion = this.baseUrl + "City/ActualizarCity";
                let response = this.http.post<any>(direccion,usuarios,this.httpOptions);
                console.log(response);
                return response;
              }
              
                eliminarCity(data:any): Observable<any>{
            
                console.log("parametro a enviar " + data)
                let direccion = this.baseUrl + "City/DeleteCity?dato=" + data;
                let response = this.http.delete<any>(direccion);
                console.log(response);
                return response;
               }
            
                getCityById(data:any): Observable<any>{
            
                console.log("parametro a enviar " + data)
                let direccion = this.baseUrl + "City/ObtenerPorId?dato" + data;
                let response = this.http.get<any>(direccion);
                console.log(response);
                return response;
  }
  
}
