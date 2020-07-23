import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

    { path: '', loadChildren: () => import('../app/auth/auth.module').then(m => m.AuthModule) },
    { path: 'album', loadChildren: () => import('../app/album/album.module').then(m => m.AlbumModule) },
  //  { path: 'watchback', loadChildren: () => import('../app/watchback/watchback.module').then(m => m.WatchbackModule) },
  //  { path: 'acl', loadChildren: () => import('../app/access-control/access-control.module').then(m => m.AccessControlModule) },
  //  { path: 'users', loadChildren: () => import('../app/users/users.module').then(m => m.UsersModule) },
    { path: '**', redirectTo: '/error' }

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }
