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
    public songs: any;
    public artists: any;
    public albumForm: FormGroup;
    public success: string;
    public editId: number;
    public submitted = false;

    constructor(private albumService: AlbumService, private modalService: NgbModal, private formBuilder: FormBuilder) { }

    ngOnInit(): void {
        this.getAlbums();
        this.getSongs();
        this.getArtists();
    }

    /**
     * 
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
     * 
     */
    public submitAlbum(): void {

        this.submitted = true;

        if (!this.albumForm.valid) {
            return;
        }

        const newDate = this.albumForm.get('release_date').value;
        const formattedDate = moment(newDate).format('YYYY-MM-DD');

        this.albumForm.patchValue({ release_date: new Date(formattedDate) });

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
                    this.modalService.dismissAll();
                    this.success = response.message;
                },
                error => this.errors = error
            );
    }

    /**
     * 
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
     * 
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

    /**
     * 
     * @param row 
     */
    public edit(row) {
        this.editId = row.id;
        this.createAlbumForm(row);
        this.modalService.open(this.albumFormModal);

    }

    /**
     * 
     * @param albumId 
     */
    public delete(albumId: number) {
        this.albumService
            .deleteAlbum(albumId)
            .subscribe(
                () => {
                    this.getAlbums();
                    this.success = 'Album Deleted Successfully';
                },
                error => this.errors = error
            );
    }

    /**
     * 
     * @param album 
     */
    private createAlbumForm(album?: any): void {
        let artistIds = [];
        let songIds = [];
        let release_date = null;
        let date_object = null;

        if (album) {
            let artists = album.artists.data;
            artists.forEach(element => {
                artistIds.push(element.id);
            });

            let songs = album.songs.data;
            songs.forEach(element => {
                songIds.push(element.id);
            });

            release_date = album.release_date;
            date_object = new Date(release_date);
        }

        this.albumForm = this.formBuilder.group({
            album_name: [_.get(album, 'album_name', ''), Validators.required],
            release_date: [date_object, Validators.required],
            artists: [artistIds, Validators.required],
            songs: [songIds, Validators.required]
        });
    }
}
