import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { RecordarComponent } from './recordar/recordar.component';
import { RegistrarseComponent } from './registrarse/registrarse.component';


@NgModule({
  declarations: [
    LoginComponent,
    RecordarComponent,
    RegistrarseComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }
