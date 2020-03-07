import { Component, OnDestroy } from "@angular/core";

@Component({
    selector: "ns-app",
    templateUrl: "./app.component.html",
})
export class AppComponent implements OnDestroy {
    constructor() {
    }

    ngOnDestroy(): void {
        console.log('App destroy');
    }
}

