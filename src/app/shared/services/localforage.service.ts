import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import * as LocalForage from 'localforage';

import { map } from 'rxjs/operators';

import { Observable } from 'rxjs';
import { forkJoin } from 'rxjs';
import { from } from 'rxjs';

import { environment } from '../../../environments/environment';

/**
 * LocalForage Service
 *
 * @export
 * @class LocalForageService
 */
@Injectable()

export class LocalForageService {

  /**
   * Instance of localforage
   *
   * @private
   * @type {LocalForage}
   * @memberOf LocalForageService
   */
  private instance: LocalForage;

  /**
   * Name of the localforage instance
   *
   * @private
   * @type {string}
   * @memberOf LocalForageService
   */
  private instanceName: string = 'WatchbackAdmin';

  /**
   * Data stored in the WatchbackAdmin instance would be cleared off when the user logs out.
   * WatchbackAdminPersistent can be used in case we need to persist the data even after the user logs out.
   *
   * @private
   * @type {string}
   * @memberOf LocalForageService
   */
  private persistentInstanceName: string = 'WatchbackAdminPersistent';

  /**
   * Creates an instance of LocalForageService.
   *
   * @memberof LocalForageService
   */
  constructor() {

    this.instance = LocalForage.createInstance({
      driver: LocalForage.LOCALSTORAGE,
      name: this.instanceName,
    });
  }

  /**
   * Returns the store instance of the localForage
   * @return {LocalForage}
   */
  public getInstance(): LocalForage {
    return this.instance;
  }

  /**
   * Returns the persistent store instance of the localForage. The data stored in this instance will be
   * persisted even after the user logs out.
   *
   * @return {LocalForage}
   */
  public getPersistentInstance(): LocalForage {

    return LocalForage.createInstance({
      driver: LocalForage.LOCALSTORAGE,
      name: this.persistentInstanceName,
    });
  }

  /**
   * Get an item by key
   *
   * @param {string} key
   * @returns {Observable<T>}
   *
   * @memberOf LocalForageService
   */
  public getItem<T>(key: string): Observable<T> {
    return from(this.instance.getItem(key))
        .pipe(
            map((item) => {

              // If item not found, return null
              if (_.isNil(item)) {
                return null;
              }

              // If expired, delete and return null
              if (this.isExpired(item as StorageItem)) {
                this.removeItem(key).subscribe();
                return null;
              }

              // Remove actual API response data
              return (item as StorageItem).data;
            }),
        );
  }

  /**
   * Get multiple items at once
   *
   * @template T
   * @param {Array<string>} keys
   * @returns {Observable<Array<T>}
   *
   * @memberOf LocalForageService
   */
  public getItems<T>(keys: Array<string>): Observable<Array<T>> {
    const observables: Array<Observable<T>> = _.map(keys, (key) => this.getItem(key));
    return forkJoin(observables);
  }

  /**
   * Set an item using key and value
   *
   * @param {string} key
   * @param {*} value
   * @returns {Observable<any>}
   *
   * @memberOf LocalForageService
   */
  public setItem(key: string, value: any):any {
    const item: any = {
      data: value
    };

    return this.instance.setItem(key, item);
  }

  /**
   * Set multiple items at once
   *
   * @param {Array<KeyValPair>} items
   * @returns {Observable<any>}
   *
   * @memberOf LocalForageService
   */
  public setItems(items: Array<any>): Observable<any> {
    const observables: Array<Observable<any>> = _.map(items, (item) => this.setItem(item.key as string, item.value));
    return forkJoin(observables);
  }

  /**
   * Remove an item using key
   *
   * @param {string} key
   * @returns {Observable<any>}
   *
   * @memberOf LocalForageService
   */
  public removeItem(key: string): any {
    return this.instance.removeItem(key);
  }

}
