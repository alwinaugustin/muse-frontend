import * as _ from 'lodash';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup,Validators} from '@angular/forms';
import { JsendResponse } from '../../../shared/interfaces/jsend.response';
import { AlbumService } from '../../services/album.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';


@Component({
    selector: 'app-album',
    templateUrl: './artist.component.html',
    styleUrls: ['./artist.component.scss']
})
export class ArtistComponent implements OnInit {

    @ViewChild('artistFormModal', { static: true }) private artistFormModal: ElementRef;


    public errors: any;

    public artists:any;

    public success: string;

    public artistForm: FormGroup;

    public editId:number;


    constructor(private albumService: AlbumService, private modalService: NgbModal,private formBuilder: FormBuilder,) { }

    ngOnInit(): void {
        this.getArtists();
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
    * Submit placement
    *
    * @param {Function} close
    * @return {void}
    */
   public submitArtist(): void {

    if (!this.artistForm.valid) {
        return;
    }


    this.errors = null;

    this.albumService
        .saveArtist(this.artistForm.value, this.editId)
        .pipe(
            finalize((): void => {
                this.getArtists();
            })
        )
        .subscribe(
            (response: JsendResponse) => {
              this.getArtists();
              this.success = response.message;
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
        this.createArtistForm();
        this.modalService.open(this.artistFormModal);
    }

    public edit(row:any) {
        this.editId = row.id;
        this.createArtistForm(row);
        this.modalService.open(this.artistFormModal);
        
    }

    public delete(albumId:number)
    {
        this.albumService
            .deleteAlbum(albumId)
            .subscribe(
                () => {
                    this.success = 'Artist Deleted successfully';
                    this.getArtists();
                },
                error => this.errors = error
            );
    }

  /**
    * Create placement form
    *
    * @return {void}
    */
   private createArtistForm(row?:any): void {

    this.artistForm = this.formBuilder.group({
        artist_name: [_.get(row, 'artist_name', ''), Validators.required]
    });
}
}
