import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable()
export class AuthGuardService implements CanActivate {

    private jwtHelper;

    constructor(public auth: AuthService, public router: Router) {

        this.jwtHelper = new JwtHelperService();
     }
    
    canActivate(): boolean {

        if (!this.auth.isAuthenticated()) {
            this.router.navigate(['login']);
            return false;
        }

        return true;
    }
}