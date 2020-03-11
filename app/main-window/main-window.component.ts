import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { registerElement } from 'nativescript-angular/element-registry';
import { Subscription } from 'rxjs';
import { confirm } from 'tns-core-modules/ui/dialogs';
import { AppService } from '~/app.service';
import { Todo } from '~/types';

registerElement('CardView', () => require('../library/nativescript-cardview').CardView);
registerElement('Fab', () => require('../library/nativescript-floatingactionbutton').Fab);

@Component({
    templateUrl: './main-window.component.html',
    styleUrls: ['./main-window.component.css'],
})
export class MainWindowComponent {
    subs: Subscription[] = [];
    isDelete: boolean = false;

    get todos(): Todo[] {
        return this.appSrv.todos;
    }

    constructor(private router: Router, private appSrv: AppService) {
        this.subs.push(this.appSrv.databaseReady.subscribe(val => val && this.appSrv.fetch()));
    }

    deleteTODO(index: number, id: number): void {
        confirm('Delete todo?').then((result): void => {
            if (result) {
                this.subs.push(
                    this.appSrv.remove(id).subscribe(success => {
                        this.isDelete = false;
                        if (success) {
                            this.appSrv.removeImageFolder(id);
                            this.appSrv.todos.splice(index, 1);
                        }
                    })
                );
            }
        });
    }

    openEdit(index: number): void {
        this.router.navigate(['/edit-todo', index || 0]);
    }

    openAdd(): void {
        this.router.navigate(['/add-todo']);
    }
}
