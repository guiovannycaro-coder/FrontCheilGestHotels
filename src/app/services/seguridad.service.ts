import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders,HttpParams} from '@angular/common/http';
import { BehaviorSubject, Observable , throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Login } from '../modelos/login';

@Injectable({
  providedIn: 'root'
})
export class SeguridadService {

  private baseUrl = "https://localhost:7170/api/gestHotel/";

  httpOptions = {
   headers: new HttpHeaders({
     'Content-Type': 'application/json'
   })
 }

  constructor(private http: HttpClient) { }
  
    login(credenciales: Login): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}Security/Authenticate`,
      credenciales,
      this.httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }

// POST: api/gestHotel/Security/RememberUser
  rememberUser(datos: Login): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}RememberUser`,
      datos,
      this.httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }



    getProfile(datos: string): Observable<any> {
  const params = new HttpParams().set('dato', datos);

  const direccion = this.baseUrl + 'Security/GetProfile';

  return this.http.get<any>(direccion, { params });
}


    private handleError(error: any): Observable<never> {
    let mensaje = 'Ocurrió un error al comunicarse con el servidor.';

    if (error.error?.message) {
      mensaje = error.error.message;
    } else if (error.status === 0) {
      mensaje = 'No fue posible conectar con el servidor.';
    } else if (error.status === 401) {
      mensaje = 'Usuario o contraseña incorrectos.';
    }

    return throwError(() => new Error(mensaje));
  }

}
