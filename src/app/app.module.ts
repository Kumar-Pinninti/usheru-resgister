import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { MockBackendInterceptor } from './interceptors/mock-backend.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    RegisterFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: MockBackendInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
