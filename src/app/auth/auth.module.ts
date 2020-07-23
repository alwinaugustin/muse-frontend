import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutes } from './auth.routes';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { ApiService } from '../shared/services/api.service';
import { GlobalService } from '../shared/services/global.service';



@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    AuthRoutes,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    AuthService,
    ApiService,
    GlobalService
  ],
})
export class AuthModule { }
