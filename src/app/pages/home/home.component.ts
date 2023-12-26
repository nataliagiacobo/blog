import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalPostComponent } from '../modal-post/modal-post.component';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { AuthService } from '../../services/auth.service';
import { IPostResponse } from '../../interfaces/IPost';
import { environment } from '../../../environments/environment';
import { catchError, map, tap, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ICommentRequest, ICommentResponse } from '../../interfaces/IComment';
import { NavbarComponent } from '../../shared/navbar/navbar.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, HttpClientModule, CommonModule, NavbarComponent],
  providers: [BsModalService, AuthService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  bsModalRef?: BsModalRef;
  public postList: IPostResponse[] = [];
  public novoComentario: string = '';
  public addCommentForm!: FormGroup;

  constructor(
    private modalService: BsModalService,
    private authService: AuthService,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  loadPosts(): void {
    const apiUrl = environment.base_url + '/post';

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authService.getBearerToken
    });

    this.http.get<IPostResponse[]>(apiUrl, { headers: headers })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      ).subscribe(
        (posts: IPostResponse[]) => {
          this.postList = posts;
          for (let i = 0; i < this.postList.length; i++) {
            this.addCommentForm.addControl('commentPost' + i, new FormControl('', Validators.required));
          }
        }
      );
  }

  ngOnInit(): void {
    this.addCommentForm = this.formBuilder.group({});
    this.loadPosts()
  }

  openModal() {
    const initialState: ModalOptions = {
      class: "modal-lg"
    };

    this.bsModalRef = this.modalService.show(ModalPostComponent, initialState);
  }

  addComment(index: number, post: IPostResponse) {
    const apiUrl = environment.base_url + '/comment';

    let comment: ICommentRequest = {};
    comment.description = this.addCommentForm.controls['commentPost' + index].value;
    comment.userId = this.authService.getUserId!;
    comment.postId = post.id;

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authService.getBearerToken
    });

    this.http.post(apiUrl, comment, {
      headers: headers
    })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      )
      .subscribe(
        (response: any) => {
          console.log('Comment bem-sucedido!', response);
          this.router.navigate(['']);
          this.loadPosts();
          this.addCommentForm.reset();
        }
      );
  }

  isUserAuthorized(commentUserId: number): boolean {
    return this.authService.getUserId === commentUserId;
  }

  deletePost(postId: number) {
    const apiUrl = environment.base_url + '/post/' + postId;

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
          this.loadPosts();
        }
      );
  }

  deleteComment(commentId: number) {
    const apiUrl = environment.base_url + '/comment/' + commentId;

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
          this.loadPosts();
        }
      );
  }
}

