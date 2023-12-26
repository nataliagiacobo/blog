import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CKEditorModule, ChangeEvent } from '@ckeditor/ckeditor5-angular';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { BsModalRef } from 'ngx-bootstrap/modal'
import { environment } from '../../../environments/environment';
import { UploadResponse } from '@ckeditor/ckeditor5-upload';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { IPostRequest } from '../../interfaces/IPost';

@Component({
  standalone: true,
  selector: 'app-modal-post',
  templateUrl: './modal-post.component.html',
  styleUrl: './modal-post.component.css',
  imports: [
    CKEditorModule,
    HttpClientModule,
    FormsModule,
    HttpClientModule
  ]
})
export class ModalPostComponent {

  constructor(
    public bsModalRef: BsModalRef,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) { }


  public Editor = ClassicEditor;
  public content: string = '';
  private post: IPostRequest = {};

  onReady(editor: ClassicEditor): void {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return new MyUploadAdapter(loader, this.http, this.authService);
    };
  }

  onSubmit() {
    const apiUrl = environment.base_url + '/post';

    this.post.content = this.content;
    this.post.userId = this.authService.getUserId!;

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authService.getBearerToken
    });

    this.http.post(apiUrl, this.post, {
      headers: headers
    })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      )
      .subscribe(
        (response: any) => {
          console.log('Post bem-sucedido!', response);
          this.router.navigate(['']);
          this.bsModalRef.hide()
        }
      );
  }

}

class MyUploadAdapter {

  constructor(
    private loader: any,
    private http: HttpClient,
    private authService: AuthService) { }

  upload() {
    return new Promise<UploadResponse>((resolve, reject) => {
      this.loader.file.then((file: string | Blob) => {
        var fd = new FormData();
        fd.append('upload', file);

        let headers = new HttpHeaders({
          'Authorization': this.authService.getBearerToken
        });

        this.http
          .post(
            environment.base_url + '/image/upload',
            fd,
            {
              headers: headers
            }
          )
          .subscribe((response: any) => {
            resolve({
              default: response.url
            })
          }
          );
      })
    })
  }

  abort() {
    console.error('aborted');
  }
}