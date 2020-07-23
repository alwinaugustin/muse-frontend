import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../shared/services/api.service';

@Injectable()
export class AlbumService {

    /**
     * Creates an instance of AuthService.
     * @param {ApiService} apiService
     *
     * @memberof AuthService
     */
    constructor(
        private apiService: ApiService
    ) { }

    /**
     * 
     */
    public getAlbums(): Observable<any> {
        return this.apiService.get('muse/albums');
    }

    /**
     * 
     */
    public getArtists(): Observable<any> {
        return this.apiService.get('muse/artists');
    }

    /**
     * 
     */
    public getSongs(): Observable<any> {
        return this.apiService.get('muse/songs');
    }

    /**
     * 
     * @param artist 
     */
    public saveArtist(artist: any, editId:number): Observable<any> {

        return editId
            ? this.apiService.put('muse/artists/' + editId, artist)
            : this.apiService.post('muse/artists', artist);

    }

    /**
     * 
     * @param song 
     * @param editId 
     */
    public saveSong(song: any, editId): Observable<any> {
        return editId
            ? this.apiService.put('muse/songs/' + editId, song)
            : this.apiService.post('muse/songs', song);
    }

    /**
     * 
     * @param album 
     * @param editId 
     */
    public saveAlbum(album: any, editId?: number): Observable<any> {

        return editId
            ? this.apiService.put('muse/albums/' + editId, album)
            : this.apiService.post('muse/albums', album);
    }

    /**
     * 
     * @param albumId 
     */
    public deleteAlbum(albumId?: number): Observable<any> {
        return this.apiService.delete('muse/albums/' + albumId);
    }
}
