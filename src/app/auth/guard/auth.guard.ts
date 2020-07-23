import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { environment } from '../../../environments/environment';


import 'rxjs/add/operator/map';
import { switchMap, tap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/observable/fromPromise';


/**
 * Guard to protect routes
 *
 * Auth Guard checks if a token is available in the local storage
 * If token is not available or expired, the guard will redirect
 * the user to the login page.
 */
@Injectable()
export class AuthGuard implements CanActivate {

    private jwtHelper;
    private localForage: LocalForage;
    private offsetSeconds: number;

    /**
     * Creates an instance of AuthGuard.
     * @param {Router} router
     * @param {LocalForageService} localForage
     * @memberof AuthGuard
     */
    constructor(
        private router: Router,
        localForage: LocalForageService,
        private apiService: ApiService,
        private globalService: GlobalService
    ) {
        this.localForage = localForage.getInstance();
        this.jwtHelper = new JwtHelperService();
        this.offsetSeconds = environment.api.token_refresh_time;
    }

    /**
     * Check whether the user is authenicated to view the route
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<boolean>}
     * @memberof AuthGuard
     */
    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

        return this.getToken().map((token: any) => {
            if (!_.isNull(token) && !this.jwtHelper.isTokenExpired(token.data)) {
                this.proactiveTokenRefresh(token);
                return true;
            }
            // Store the attempted URL for redirecting
            this.localForage.setItem('redirectUrl', state.url).then(() => {
                // Navigate to the login page
                this.router.navigate(['/login']);
                return false;
            });
        });
    }


    /**
     * The Router canActivate method must return an Observable Boolean or Boolean
     * LocalForage returns a promise so converting it to Observable
     *
     * @returns {Observable<{}>}
     */
    private getToken(): Observable<{}> {

        const token = this.localForage.getItem('id_token');
        return fromPromise(token);
    }

    /**
     * Proactive refresh token mechanism
     *
     * @private
     * @param {string} token
     * @memberof AuthGuard
     */
    private proactiveTokenRefresh(token: any) {

        // Check if token is set to expire in `token_refresh_time`
        if (this.jwtHelper.isTokenExpired(token.data, this.offsetSeconds)) {

            // Refresh the user's token
            this.refreshToken().subscribe();
        }
    }
}
