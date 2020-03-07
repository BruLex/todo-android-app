import { Injectable } from '@angular/core';
import { CanActivate, CanDeactivate, Router } from '@angular/router';
import { getString } from "@nativescript/core/application-settings";


export interface ComponentCanDeactivate{
    canDeactivate: () => boolean;
}

@Injectable({ providedIn: 'root' })
export class MainGuard implements CanActivate, CanDeactivate<ComponentCanDeactivate> {
    constructor(private router: Router) {
    }

    canActivate(): boolean {
        // if (!!getString("mode")) {
        //     if (getString("mode") === 'add') {
        //         this.router.navigate(['/add-todo']);
        //     } else {
        //         this.router.navigate(['/edit-todo', getString('id')]);
        //     }
        //     return false;
        // }
        return true;
    }

    canDeactivate(component: ComponentCanDeactivate): boolean {
        return component.canDeactivate ? component.canDeactivate() : true;
    }
}
