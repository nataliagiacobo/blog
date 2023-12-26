import { HttpClient, HttpHeaders } from "@angular/common/http";
import { IUser } from "../interfaces/IUser";
import { Observable, tap } from "rxjs";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";
import { Injectable } from "@angular/core";

const apiUrlUser = environment.base_url + "/login";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private httpClient: HttpClient,
        private router: Router) { }

    login(user: IUser): Observable<any> {

        const authorization = ('Basic ' + btoa(user.username + ':' + user.password));

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': authorization
        });

        return this.httpClient.post<any>(apiUrlUser, null, {
            observe: 'response',
            headers: headers
        })
            .pipe(
                tap((response) => {
                    if (response.status != 200) return;
                    localStorage.setItem('token', btoa(response.body.token));
                    localStorage.setItem('username', btoa(JSON.stringify(response.body.username)));
                    localStorage.setItem('userId', btoa(JSON.stringify(response.body.userId)));
                    this.router.navigate(['']);
                }));
    }

    logout() {
        localStorage.clear();
        this.router.navigate(['login']);
    }

    get getCurrentUsername(): string | null {
        return localStorage.getItem('username')
            ? atob(localStorage.getItem('username')!)
            : null;
    }

    get getToken(): string {
        return localStorage.getItem('token')
            ? atob(localStorage.getItem('token')!)
            : '';
    }

    get getBearerToken(): string {
        return "Bearer " + this.getToken;
    }

    get getUserId(): number | null {
        return localStorage.getItem('userId')
            ? Number.parseInt(atob(localStorage.getItem('userId')!))
            : null;
    }

    get isLoggedIn(): boolean {
        return localStorage.getItem('token') ? true : false;
    }
}