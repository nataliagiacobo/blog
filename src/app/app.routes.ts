import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, Routes, UrlTree } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { ModalPostComponent } from './pages/modal-post/modal-post.component';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';
import { AlbumComponent } from './pages/album/album.component';


const AuthGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
    return inject(AuthService).isLoggedIn
        ? true
        : inject(Router).createUrlTree(['/login']); // Verifica se o usuário está autenticado (lógica fictícia)
};

export const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'album', component: AlbumComponent, canActivate: [AuthGuard] }

];

