import * as _ from 'lodash';
import * as moment from 'moment';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AlbumService } from '../../services/album.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { JsendResponse } from '../../../shared/interfaces/jsend.response';


@Component({
    selector: 'app-album',
    templateUrl: './album.component.html',
    styleUrls: ['./album.component.scss']
})
export class AlbumComponent implements OnInit {

    @ViewChild('albumFormModal', { static: true }) private albumFormModal: ElementRef;

    get f() { return this.albumForm.controls; }

    public errors: any;

    public albums: any;
    public songs:any;
    public artists:any;
    public albumForm: FormGroup;
    public success: string;
    public editId:number;
    public submitted = false;

    constructor(private albumService: AlbumService, private modalService: NgbModal,private formBuilder: FormBuilder) { }

    ngOnInit(): void {
        this.getAlbums();
        this.getSongs();
        this.getArtists();
    }

    /**
     * Load User list
     *
     * @private
     *
     * @memberOf UserListComponent
     */
    public getAlbums() {

        this.albumService
            .getAlbums()
            .subscribe(
                (response: any) => {

                    this.albums = response.data.data;
                },
                error => this.errors = error
            );
    }

    /**
    * Submit placement
    *
    * @param {Function} close
    * @return {void}
    */
   public submitAlbum(): void {

    this.submitted = true;

    if (!this.albumForm.valid) {
        return;
    }

    const newDate = this.albumForm.get('release_date').value;
    const formattedDate = moment(newDate).format('YYYY-MM-DD').toString();

    this.albumForm.patchValue({release_date:new Date(formattedDate)});

    this.errors = null;

    this.albumService
        .saveAlbum(this.albumForm.value, this.editId)
        .pipe(
            finalize((): void => {
                this.getSongs();
            })
        )
        .subscribe(
            (response: JsendResponse) => {
                this.getSongs();
                this.success = response.message;
            },
            error => this.errors = error
        );
}

    /**
     * Load User list
     *
     * @private
     *
     * @memberOf UserListComponent
     */
    public getArtists() {

        this.albumService
            .getArtists()
            .subscribe(
                (response: any) => {

                    this.artists = response.data.data;
                },
                error => this.errors = error
            );
    }

    /**
     * Load User list
     *
     * @private
     *
     * @memberOf UserListComponent
     */
    public getSongs() {

        this.albumService
            .getSongs()
            .subscribe(
                (response: any) => {

                    this.songs = response.data.data;
                },
                error => this.errors = error
            );
    }

    /*
    * Open modal
    *
    * @param {any} content
    * @return {void}
    */
    public openModal(content?: any): void {
        this.createAlbumForm();
        this.modalService.open(this.albumFormModal);
    }

    public edit(row) {
        this.editId = row.id;
        this.createAlbumForm(row);
        this.modalService.open(this.albumFormModal);
        
    }

    public delete(albumId:number)
    {
        this.albumService
            .deleteAlbum(albumId)
            .subscribe(
                () => {
                    this.getAlbums();
                },
                error => this.errors = error
            );
    }

    /**
      * Create placement form
      *
      * @return {void}
      */
     private createAlbumForm(album?:any): void {
         let artistIds = [];
         let songIds = [];

        if(album) {
            let artists = album.artists.data;
            artists.forEach(element => {
                artistIds.push(element.id);
            });

            let songs = album.songs.data;
            songs.forEach(element => {
                songIds.push(element.id);
            });
        }

        this.albumForm = this.formBuilder.group({
            album_name: [_.get(album, 'album_name', ''), Validators.required],
            release_date: [_.get(album, 'release_date', ''), Validators.required],
            artists: [artistIds, Validators.required],
            songs: [songIds, Validators.required]
        });
    }
}
