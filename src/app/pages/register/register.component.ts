import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IUser } from '../../interfaces/IUser';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  public user: IUser = {};

  constructor(private http: HttpClient, private router: Router) { }

  onSubmit() {
    const apiUrl = environment.base_url + '/user';

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http.post(apiUrl, this.user, {
      headers: headers
    })
      .pipe(
        catchError((error) => {
          console.error('Erro ao autenticar:', error);
          return throwError(error);
        })
      )
      .subscribe(
        (response: any) => {
          console.log('Login bem-sucedido!', response);
          this.router.navigate(['/login']);
        }
      );
  }

}

