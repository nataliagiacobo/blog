import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
import { catchError, take, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { ModalAlbumComponent } from '../modal-album/modal-album.component';
import { IAlbumResponse } from '../../interfaces/IAlbum';


@Component({
  selector: 'app-album',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, HttpClientModule, CommonModule, NavbarComponent],
  providers: [BsModalService, AuthService],
  templateUrl: './album.component.html',
  styleUrl: './album.component.css'
})
export class AlbumComponent implements OnInit {

  bsModalRef?: BsModalRef;
  public albumList: IAlbumResponse[] = [];

  constructor(
    private modalService: BsModalService,
    private authService: AuthService,
    private http: HttpClient
  ) { }

  loadAlbums(): void {
    const apiUrl = environment.base_url + '/album';

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authService.getBearerToken
    });

    this.http.get<IAlbumResponse[]>(apiUrl, { headers: headers })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      ).subscribe(
        (albums: IAlbumResponse[]) => {
          this.albumList = albums;
        }
      );
  }

  ngOnInit(): void {
    this.loadAlbums()
  }

  openModal() {
    const initialState: ModalOptions = {
      class: "modal-lg"
    };

    this.bsModalRef = this.modalService.show(ModalAlbumComponent, initialState);

    this.modalService.onHide
      .pipe(take(1))
      .subscribe(() => {
        this.loadAlbums();
      });
  }

  isUserAuthorized(albumId: number): boolean {
    return this.authService.getUserId === albumId;
  }

  deleteAlbum(albumId: number) {
    const apiUrl = environment.base_url + '/album/' + albumId;

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authService.getBearerToken
    });

    this.http.delete(apiUrl, { headers: headers })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      ).subscribe(
        () => {
          this.loadAlbums();
        }
      );
  }
}

