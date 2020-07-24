import * as _ from 'lodash';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JsendResponse } from '../../../shared/interfaces/jsend.response';
import { AlbumService } from '../../services/album.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';


@Component({
    selector: 'app-album',
    templateUrl: './song.component.html',
    styleUrls: ['./song.component.scss']
})
export class SongComponent implements OnInit {

    @ViewChild('songFormModal', { static: true }) private songFormModal: ElementRef;


    public errors: any;

    public songs: any;

    public success: string;

    public songForm: FormGroup;

    public editId:number;


    constructor(private albumService: AlbumService, private modalService: NgbModal, private formBuilder: FormBuilder,) { }

    ngOnInit(): void {
        this.getSongs();
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

    /**
    * Submit placement
    *
    * @param {Function} close
    * @return {void}
    */
    public submitSong(): void {

        if (!this.songForm.valid) {
            return;
        }


        this.errors = null;

        this.albumService
            .saveSong(this.songForm.value, this.editId)
            .pipe(
                finalize((): void => {
                    this.getSongs();
                })
            )
            .subscribe(
                (response: JsendResponse) => {
                    this.getSongs();
                    this.success = response.message;
                    this.modalService.dismissAll();
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
        //this.resetMessages();
        this.createSongsForm();
        this.modalService.open(this.songFormModal);
    }

    public edit(row:any) {
        this.editId = row.id;
        this.createSongsForm(row);
        this.modalService.open(this.songFormModal);
        
    }

    public delete(albumId:number)
    {
        this.albumService
            .deleteAlbum(albumId)
            .subscribe(
                () => {
                    this.success = 'Song deleted successfully';
                    this.getSongs();
                },
                error => this.errors = error
            );
    }

    /**
      * Create placement form
      *
      * @return {void}
      */
    private createSongsForm(song?:any): void {

        this.songForm = this.formBuilder.group({
            song_name: [_.get(song, 'song_name', ''), Validators.required],
            song_duration: [_.get(song, 'song_duration', ''), Validators.required]
        });
    }
}
