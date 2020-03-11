import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getString } from '@nativescript/core/application-settings';
import { exit } from 'nativescript-exit';
import * as application from 'tns-core-modules/application';
import { AndroidActivityBackPressedEventData, AndroidApplication } from 'tns-core-modules/application';
import { clear } from 'tns-core-modules/application-settings';
import { AppService } from '~/app.service';

@Component({
    selector: 'ns-app',
    template: '<page-router-outlet></page-router-outlet>',
})
export class AppComponent implements OnInit {
    activityBackPressedEventTime: number = 0;

    constructor(private router: Router, private appSrv: AppService) {
        application.android.on(
            AndroidApplication.activityBackPressedEvent,
            (data: AndroidActivityBackPressedEventData) => {
                data.cancel = true;
                if (Date.now() - this.activityBackPressedEventTime < 500) {
                    exit();
                }
                this.activityBackPressedEventTime = Date.now();
                if (!['/main-window', ''].includes(this.router.url)) {
                    clear();
                    this.appSrv.clearCacheFolder();
                    this.router.navigate(['/main-window']);
                }
            }
        );
    }

    ngOnInit(): void {
        if (!!getString('mode')) {
            if (getString('mode') === 'add') {
                this.router.navigate(['/add-todo']);
            } else {
                this.router.navigate(['/edit-todo', getString('id')]);
            }
        }
    }
}
