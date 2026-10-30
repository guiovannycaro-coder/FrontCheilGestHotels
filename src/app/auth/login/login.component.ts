import { Component , OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { Router } from '@angular/router';
import { SeguridadService } from '../../services/seguridad.service';
import { Users } from '../../modelos/users'
import { Login } from '../../modelos/login'
import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent  implements OnInit{

    email: string ="";
  password: string ="";

  userdata: any;
   loginform: FormGroup;


    constructor(private builder: FormBuilder, private api: SeguridadService, private router: Router) {
    
   this.loginform = this.builder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

    ngOnInit():void{
    this.checkLocalStorage();
  }
  
  checkLocalStorage() {
       if (typeof localStorage === 'undefined') {
    return;
    }
    
    const token = localStorage.getItem('token');
    
   if (token) {
    this.router.navigate(['/dahboard']);
  }
}

 onSubmit(): void {
    console.log('Formulario enviado');

    if (this.loginform.invalid) {
      this.loginform.markAllAsTouched();

     Swal.fire({
      icon: 'error',
      title: 'Error',
      text:  'Por favor, ingrese un correo y una contraseña válidos.',
      confirmButtonText: 'Aceptar'
     });
      return;
    }

    const credenciales = this.loginform.value;

    console.log('Enviando credenciales:', {
      email: credenciales.email,
      password: '********'
    });

    this.api.login(credenciales).subscribe({
      next: (respuesta: any) => {
        this.userdata = respuesta;

        console.log('Respuesta del servidor:', respuesta);

        if (respuesta?.authenticated === true) {
          const email = this.loginform.get('email')?.value;

          sessionStorage.setItem('email', email);
          console.log('Usuario guardado:', sessionStorage.getItem('email')); 
          this.router.navigate(['/dashboard']);

        } else {
        Swal.fire({
          icon: 'error',
          title: 'Error de autenticación',
          text: respuesta?.message ?? 'Credenciales incorrectas.',
          confirmButtonText: 'Aceptar'
         });
        }
      },
      error: (error: Error) => {
        console.error('Error en la autenticación:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'No fue posible iniciar sesión.',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }
  
}