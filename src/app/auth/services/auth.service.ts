import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../shared/services/api.service';


@Injectable()
export class AuthService {

    /**
     * Creates an instance of AuthService.
     * @param {ApiService} apiService
     *
     * @memberof AuthService
     */
    constructor(
        private apiService: ApiService
    ) {}

    /**
     * Attempt Login
     *
     * @param {any} body
     * @returns Observable<any>
     */
    public login(body: any): Observable<any> {
        return this.apiService.post('auth/login', body);
    }
}
