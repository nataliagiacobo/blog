import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal'
import { environment } from '../../../environments/environment';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { IAlbumRequest, IAlbumResponse } from '../../interfaces/IAlbum';

@Component({
  standalone: true,
  selector: 'app-modal-album',
  templateUrl: './modal-album.component.html',
  styleUrl: './modal-album.component.css',
  imports: [
    HttpClientModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    ReactiveFormsModule
  ]
})
export class ModalAlbumComponent implements OnInit {

  selectedPhotos: File[] = [];
  public albumForm!: FormGroup;
  private album: IAlbumRequest = {};

  constructor(
    public bsModalRef: BsModalRef,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.albumForm = this.formBuilder.group({
      albumName: [null, [Validators.required]],
      albumDescription: [null, [Validators.required]],
      photoInput: [null, Validators.required],
    });
  }

  handleFileInput(event: any) {
    const files: File[] = event.target.files;
    if (files) {
      for (const file of files) {
        this.selectedPhotos.push(file);
      }
    }
  }

  getPhotoUrl(photo: File): string {
    return URL.createObjectURL(photo);
  }

  removePhoto(index: number) {
    this.selectedPhotos.splice(index, 1);
  }

  onSubmit() {

    if (this.albumForm.invalid)
      return;

    this.album.name = this.albumForm.controls['albumName'].value;
    this.album.description = this.albumForm.controls['albumDescription'].value;
    this.album.userId = this.authService.getUserId!;

    const apiUrl = environment.base_url + '/album';

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authService.getBearerToken
    });

    this.http.post<IAlbumResponse>(apiUrl, this.album, {
      headers: headers
    })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      )
      .subscribe(
        (response: IAlbumResponse) => {
          this.saveImages(response.id!);
          this.router.navigate(['/album']);
          this.bsModalRef.hide()
        }
      );
  }

  saveImages(albumId: number) {
    this.selectedPhotos.forEach((photo) => {

      let file: Blob = new Blob([photo], { type: photo.type });

      let fd = new FormData();
      fd.append('upload', file);

      let headers = new HttpHeaders({
        'Authorization': this.authService.getBearerToken
      });

      this.http
        .post(
          environment.base_url + '/image/upload/album/' + albumId,
          fd,
          {
            headers: headers
          }
        )
        .subscribe((response: any) => { }
        );
    })


  }


}
