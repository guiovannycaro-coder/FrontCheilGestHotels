import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders,HttpParams} from '@angular/common/http';
import { BehaviorSubject, Observable , throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';


import { Users } from '../modelos/users';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

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
  


    getUsuariosList(): Observable<any>{
    let direccion = this.baseUrl + "Users/ObtenerTodos";
    let response = this.http.get<any>(direccion,this.httpOptions);
    console.log(response);
    return response;
  }

   createUsuarios(usuarios: Users): Observable<any>{
    let direccion = this.baseUrl + "Users/InsertarUsuarios";
    let response = this.http.post<any>(direccion,usuarios,this.httpOptions);

    return response;

   }

  
   actualizarUsuarios(usuarios: Users): Observable<any>{
    let direccion = this.baseUrl + "Users/actualizarUsuarios/";
    let response = this.http.post<any>(direccion,usuarios,this.httpOptions);
    console.log(response);
    return response;
  }
  
    eliminarusuario(data:any): Observable<any>{

    console.log("parametro a enviar " + data)
    let direccion = this.baseUrl + "Users/eliminarUsuarios?dato=" + data;
    let response = this.http.delete<any>(direccion);
    console.log(response);
    return response;
   }

    getusuarioById(data:any): Observable<any>{

    console.log("parametro a enviar " + data)
    let direccion = this.baseUrl + "Users/ObtenerPorId?dato" + data;
    let response = this.http.get<any>(direccion);
    console.log(response);
    return response;
  }


  getUsuarioPerfil(datos: string): Observable<any> {
  const params = new HttpParams().set('dato', datos);

  const direccion = this.baseUrl + 'Users/ObtenerUserRole';

  return this.http.get<any>(direccion, { params });
}

}
