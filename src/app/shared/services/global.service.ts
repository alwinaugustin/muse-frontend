import * as _ from 'lodash';

import { Injectable } from '@angular/core';
import * as LocalForage from 'localforage';


/**
 * Global Service
 *
 * @export
 * @class GlobalService
 */
@Injectable()

export class GlobalService {

    public static token: string = null;

    /**
     * Set the admin id before app bootstraps
     * Set admin id to 0 if there is any error
     */
    public setToken(): Promise<void> {
        return LocalForage.getItem('id_token')
            .then((id_token: any) => {
                GlobalService.token = id_token;
            })
            .catch(() => {
                GlobalService.token = null;
            });
    }
}
