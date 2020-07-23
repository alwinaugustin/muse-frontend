import * as _ from 'lodash';
import { Component, ElementRef, HostBinding, OnInit, ViewChild } from '@angular/core';
import { Router, Event as RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';


declare const jQuery: any;

/**
 * Layout Component
 *
 * @export
 * @class LayoutComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'adm-layout',
    templateUrl: 'layout.component.html'
})
export class LayoutComponent implements OnInit {

    /**
     * Component Initialization Callback
     *
     *
     * @memberof LayoutComponent
     */
    public ngOnInit(): void {
        //this.initialize();
    }


}
