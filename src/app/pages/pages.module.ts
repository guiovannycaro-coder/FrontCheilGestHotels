import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CityComponent } from './city/city.component';
import { ContryComponent } from './contry/contry.component';
import { DepartmentComponent } from './department/department.component';
import { DocumenttypeComponent } from './documenttype/documenttype.component';
import { HotelsComponent } from './hotels/hotels.component';
import { RolesComponent } from './roles/roles.component';
import { UsersComponent } from './users/users.component';
import { PagesComponent } from './pages.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { NgxPaginationModule } from 'ngx-pagination';
import { AddhotelsComponent } from '../modals/hotels/addhotels/addhotels.component';
import { EdithotelsComponent } from '../modals/hotels/edithotels/edithotels.component';
import { BusavanzadaUnoComponent } from '../modals/busquedas/busavanzada-uno/busavanzada-uno.component';

@NgModule({
  declarations: [
    DashboardComponent,
    CityComponent,
    ContryComponent,
    DepartmentComponent,
    DocumenttypeComponent,
    HotelsComponent,
    AddhotelsComponent,
    EdithotelsComponent,
     BusavanzadaUnoComponent,
    RolesComponent,
    UsersComponent,
    PagesComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
 
     // Angular Material
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatDialogModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,

 
  ]
})
export class PagesModule { }
