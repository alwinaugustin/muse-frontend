import { RouterModule } from '@angular/router';


import { AuthGuardService } from '../auth/guard/auth.guard';
import { AlbumComponent } from './components/album/album.component';
import { SongComponent } from './components/song/song.component';
import { ArtistComponent } from './components/artist/artist.component';

import { LayoutComponent } from '../shared/components/layout/components/layout.component';

/**
 * Authentication Routes
 */
export const AlbumRoutes = RouterModule.forChild([
    {
        path: '',
        component: LayoutComponent,
        canActivate: [AuthGuardService],
        children: [
            {
                path: '',
                component: AlbumComponent
            },
            {
                path: 'songs',
                component:SongComponent
            },
            {
                path: 'artists',
                component:ArtistComponent
            }
        ]
    }
]);
