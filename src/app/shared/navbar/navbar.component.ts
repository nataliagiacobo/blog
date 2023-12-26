import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    standalone: true,
    imports: [RouterModule],
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

    constructor(
        private authService: AuthService
    ) { }

    logout() {
        this.authService.logout();
    }
}
