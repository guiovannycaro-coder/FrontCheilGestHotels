import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders,HttpParams} from '@angular/common/http';
import { BehaviorSubject, Observable , throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';

import { DocumentType } from '../modelos/DocumentType';

@Injectable({
  providedIn: 'root'
})
export class DocumenttypepeService {

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

   getDocumentTypeList(): Observable<any>{
          let direccion = this.baseUrl + "DocumentType/ObtenerTodos";
          let response = this.http.get<any>(direccion,this.httpOptions);
          console.log(response);
          return response;
        }
      
         createDocumentType(usuarios: DocumentType): Observable<any>{
          let direccion = this.baseUrl + "DocumentType/InsertarDocumentType";
          let response = this.http.post<any>(direccion,usuarios,this.httpOptions);
      
          return response;
      
         }
      
        
         actualizarDocumentType(usuarios: DocumentType): Observable<any>{
          let direccion = this.baseUrl + "DocumentType/ActualizarDocumentType";
          let response = this.http.post<any>(direccion,usuarios,this.httpOptions);
          console.log(response);
          return response;
        }
        
          eliminarDocumentType(data:any): Observable<any>{
      
          console.log("parametro a enviar " + data)
          let direccion = this.baseUrl + "DocumentType/DeleteDocumentType?dato=" + data;
          let response = this.http.delete<any>(direccion);
          console.log(response);
          return response;
         }
      
          getDocumentTypeById(data:any): Observable<any>{
      
          console.log("parametro a enviar " + data)
          let direccion = this.baseUrl + "DocumentType/ObtenerPorId?dato" + data;
          let response = this.http.get<any>(direccion);
          console.log(response);
          return response;
        }
}
