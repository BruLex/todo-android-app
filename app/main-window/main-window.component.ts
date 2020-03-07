import { Component, } from "@angular/core";
import { Router } from "@angular/router";
import { registerElement } from "nativescript-angular/element-registry";
import { exit } from "nativescript-exit";
import { Subscription } from "rxjs";
import { confirm } from "tns-core-modules/ui/dialogs";
import { AppService, Todos } from "~/app.service";

registerElement("CardView", () => require('../library/nativescript-cardview').CardView);
registerElement("Fab", () => require('../library/nativescript-floatingactionbutton').Fab);

@Component({
    templateUrl: "./main-window.component.html",
    styleUrls: ['./main-window.component.css'],
})
export class MainWindowComponent {

    exit: typeof exit = exit;

    subs: Subscription[] = [];

    isDelete: boolean = false;

    get todos(): Todos[] {
        return this.appSrv.todos;
    }

    constructor(private router: Router, private appSrv: AppService) {

        this.subs.push(this.appSrv.databaseReady.subscribe(val => val && this.appSrv.fetch()));
    }

    deleteTODO(index: number, id: number): void {
        confirm("Delete todo?").then((result): void => {
            console.log("Dialog result: " + result);
            if (result) {
                this.subs.push(this.appSrv.remove(id).subscribe(
                    success => {
                        this.isDelete = false;
                        if (success) {
                            this.appSrv.removeImageFolder(id);
                            this.appSrv.todos.splice(index, 1);
                        }
                    }
                ));
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
