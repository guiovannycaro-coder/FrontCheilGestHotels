import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders,HttpParams} from '@angular/common/http';
import { BehaviorSubject, Observable , throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Department } from '../modelos/Department';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

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

   getDepartmentList(): Observable<any>{
            let direccion = this.baseUrl + "Department/ObtenerTodos";
            let response = this.http.get<any>(direccion,this.httpOptions);
            console.log(response);
            return response;
          }
        
           createDepartment(usuarios: Department): Observable<any>{
            let direccion = this.baseUrl + "Department/InsertarDepartment";
            let response = this.http.post<any>(direccion,usuarios,this.httpOptions);
        
            return response;
        
           }
        
          
           actualizarDepartment(usuarios: Department): Observable<any>{
            let direccion = this.baseUrl + "Department/ActualizarDepartment";
            let response = this.http.post<any>(direccion,usuarios,this.httpOptions);
            console.log(response);
            return response;
          }
          
            eliminarDepartment(data:any): Observable<any>{
        
            console.log("parametro a enviar " + data)
            let direccion = this.baseUrl + "Department/DeleteDocumentType?dato=" + data;
            let response = this.http.delete<any>(direccion);
            console.log(response);
            return response;
           }
        
            getDepartmentById(data:any): Observable<any>{
        
            console.log("parametro a enviar " + data)
            let direccion = this.baseUrl + "Department/ObtenerPorId?dato" + data;
            let response = this.http.get<any>(direccion);
            console.log(response);
            return response;
          }
}
