import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';

import { RouterModule } from '@angular/router';
import { RadioButtonModule } from '@webileapps/nativescript-radiobutton/angular';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { NativeScriptHttpClientModule } from 'nativescript-angular/http-client';
import { TNSFontIconModule } from 'nativescript-ngx-fonticon';
import { NativeScriptUIAutoCompleteTextViewModule } from 'nativescript-ui-autocomplete/angular';
import { NativeScriptUICalendarModule } from 'nativescript-ui-calendar/angular';
import { NativeScriptUIChartModule } from 'nativescript-ui-chart/angular';
import { NativeScriptUIDataFormModule } from 'nativescript-ui-dataform/angular';
import { NativeScriptUIGaugeModule } from 'nativescript-ui-gauge/angular';
import { NativeScriptUIListViewModule } from 'nativescript-ui-listview/angular';
import { NativeScriptUISideDrawerModule } from 'nativescript-ui-sidedrawer/angular';
import { AddEditTodoComponent } from '~/add-edit-todo/add-edit-todo.component';
import { AppService } from '~/app.service';
import { FloatLabel } from '~/float-label/float-label.component';
import { MainWindowComponent } from '~/main-window/main-window.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
    bootstrap: [AppComponent],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        RouterModule,
        RadioButtonModule,
        NativeScriptFormsModule,
        NativeScriptHttpClientModule,

        NativeScriptUISideDrawerModule,
        NativeScriptUIListViewModule,
        NativeScriptUICalendarModule,
        NativeScriptUIChartModule,
        NativeScriptUIDataFormModule,
        NativeScriptUIAutoCompleteTextViewModule,
        NativeScriptUIGaugeModule,

        TNSFontIconModule.forRoot({
            mdi: require('./material-design-icons.css'),
        }),
    ],
    declarations: [AppComponent, MainWindowComponent, AddEditTodoComponent, FloatLabel],
    providers: [AppService],
    schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}
