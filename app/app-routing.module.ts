import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { AddEditTodoComponent } from "~/add-edit-todo/add-edit-todo.component";
import { MainWindowComponent } from "~/main-window/main-window.component";
import { MainGuard } from "~/main.guard";

const routes: Routes = [
    {
        path: "",
        canActivate: [MainGuard],
        children: [
            { path: "", redirectTo: "/main-window", pathMatch: "full" },
            { path: "main-window", component: MainWindowComponent },
            { path: "add-todo", canDeactivate: [MainGuard], component: AddEditTodoComponent, data: { mode: 'add' } },
            { path: "edit-todo/:id", canDeactivate: [MainGuard], component: AddEditTodoComponent, data: { mode: 'edit' } },
        ],
    },

];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}
