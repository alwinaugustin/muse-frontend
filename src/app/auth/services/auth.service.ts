import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

import { ApiService } from '../../shared/services/api.service';
import { GlobalService } from '../../shared/services/global.service';


@Injectable()
export class AuthService {

    private jwtHelper;

    /**
     * Creates an instance of AuthService.
     * @param {ApiService} apiService
     *
     * @memberof AuthService
     */
    constructor(
        private apiService: ApiService
    ) {
        this.jwtHelper = new JwtHelperService();
    }

    /**
     * Attempt Login
     *
     * @param {any} body
     * @returns Observable<any>
     */
    public login(body: any): Observable<any> {
        return this.apiService.post('auth/login', body);
    }

    public isAuthenticated(): boolean {
        const token = GlobalService.token;
        return !this.jwtHelper.isTokenExpired(token);
      }
}
