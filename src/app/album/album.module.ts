import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlbumComponent } from './components/album/album.component';
import { AlbumRoutes } from './album.routes';
import { SharedModule } from './../shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { AlbumService } from '../album/services/album.service';
import { ApiService } from './../shared/services/api.service';
import {CalendarModule} from 'primeng/calendar';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {SpinnerModule} from 'primeng/spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ArtistComponent } from './components/artist/artist.component';
import { SongComponent } from './components/song/song.component';
import {TableModule} from 'primeng/table';
import { AuthGuardService } from '../auth/guard/auth.guard';
import { AuthService } from '../auth/services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';


@NgModule({
  declarations: [AlbumComponent, ArtistComponent, SongComponent],
  imports: [
    CommonModule,
    AlbumRoutes,
    SharedModule,
    DataTablesModule,
    SharedModule,
    CalendarModule,
    AutoCompleteModule,
    SpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule
  ],
  providers:[
    ApiService,
    AlbumService,
    AuthGuardService,
    AuthService,
    JwtHelperService
  ]
})
export class AlbumModule { }
