import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from './shared/services/global.service';


export function globalServiceFactory(globalService: GlobalService) {
   return () => globalService.setToken();
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    HttpClientJsonpModule,
    NgbModule
  ],
  providers: [
    GlobalService,
    {
      provide: APP_INITIALIZER,
      useFactory: globalServiceFactory,
      deps: [GlobalService],
      multi: true,
  },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
