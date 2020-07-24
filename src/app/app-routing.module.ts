import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

    { path: '', loadChildren: () => import('../app/auth/auth.module').then(m => m.AuthModule) },
    { path: 'album', loadChildren: () => import('../app/album/album.module').then(m => m.AlbumModule) },
    { path: '**', redirectTo: '/error' }

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }
