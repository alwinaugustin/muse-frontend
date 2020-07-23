import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { GlobalService } from './global.service';


@Injectable()
export class ApiService {

    private method: any;

    private instance: LocalForage;

    private instanceName: string = 'Muse';

    constructor(
        private http: HttpClient
    ) {
     }

    /**
     * Interface for HTTP Get
     *
     * @param {string} url
     * @param {URLSearchParams} params
     * @returns {Observable<ApiResponse>}
     *
     * @memberOf ApiService
     */
    public get(url: string, params: Object = {}): Observable<any> {

        return this.request(url, { method: 'GET', params });
    }

    /**
     * Interface for HTTP Post
     *
     * @param {string} url
     * @param {Object} [data]
     * @returns {Observable<ApiResponse>}
     *
     * @memberOf ApiService
     */
    public post(url: string, data?: Object): Observable<any> {

        return this.request(url, { method: 'POST' }, data);
    }

    /**
     * Interface for HTTP Put
     *
     * @param {string} url
     * @param {Object} [data]
     * @returns {Observable<ApiResponse>}
     *
     * @memberOf ApiService
     */
    public put(url: string, data?: Object): Observable<any> {

        return this.request(url, { method: 'PUT' }, data);
    }

    /**
     * Interface for HTTP Delete
     *
     * @param {string} url
     * @param {Object} params
     * @returns {Observable<ApiResponse>}
     *
     * @memberOf ApiService
     */
    public delete(url: string, params?: Object): Observable<any> {

        return this.request(url, { method: 'DELETE', params });
    }

    /**
     * Interceptor logic for all ApiService HTTP methods
     *
     * @private
     * @param {string} url
     * @param options
     * @param {Object} [data]
     * @returns {Observable<ApiResponse>}
     *
     * @memberOf ApiService
     */
    private request(url: string, options, data?: Object): Observable<any> {
        this.method         = options.method;
        const httpParams    = new HttpParams({ fromObject: options.params });
        let headers         = new HttpHeaders();
       // let token:any = null;

       console.log(GlobalService.token);

       if (GlobalService.token) {
            headers = headers.append('Authorization', 'Bearer ' +GlobalService.token);
        };

        if (this.method === 'POST' || this.method === 'PUT') {
            headers = headers.append('Content-Type', 'application/json');
        }

        const httpOptions = (data == null)
            ? { params: httpParams, headers }
            : { params: httpParams, headers, body: JSON.stringify(data) };

        return this.apiCallWrapper(url, httpOptions, this.method);
    }

    /**
     * Get from cache if allowed, else call API (and cache if required)
     *
     * @private
     * @param {string} url
     * @param {RequestOptionsArgs} options
     * @returns {Observable<ApiResponse>}
     *
     * @memberOf ApiService
     */
    private apiCallWrapper(url: string, options: any, method: string): any {
        
        const baseURL = environment.api.base_url;
        
        return this.http
            .request(this.method, baseURL+url, options)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    const errors: any = {
                        error: error.error.message,
                        formError: error.error.data.validation ? error.error.data.validation : null
                    };

                    return Observable.throw(errors);
                })
            );
    }
}
