import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
    selector: 'FloatLabel',
    moduleId: module.id,
    template: `
        <GridLayout rows="30, auto" marginBottom="5">
            <Label
                    [width]="width"
                    #label
                    row="1"
                    [text]="placeholder"
                    opacity="0.4"
                    fontSize="14"
                    class="input"
            ></Label>
            <TextField
                    *ngIf="type === 'field'"
                    #textField
                    [width]="width"
                    [secure]="secure"
                    row="1"
                    [ngModel]="_value"
                    (ngModelChange)="textChanged($event)"
                    (focus)="onFocus()"
                    (blur)="onBlur()"
                    borderBottomWidth="1"
                    padding="2"
            >
            </TextField>
            <TextView
                    *ngIf="type === 'view'"
                    #textView
                    [width]="width"
                    row="1"
                    [ngModel]="_value"
                    (ngModelChange)="textChanged($event)"
                    (focus)="onFocus()"
                    (blur)="onBlur()"
                    borderBottomWidth="1"
                    padding="2"
            >
            </TextView>
        </GridLayout>
    `,
})
export class FloatLabel implements OnDestroy, OnInit {
    @Input() placeholder: string;
    @Input() secure: boolean;
    @Input() width: number = null;

    @Input() type: 'field' | 'view' = 'field';

    @ViewChild('label', { static: false }) label: ElementRef;
    @ViewChild('textField', { static: false }) textField: ElementRef;
    @ViewChild('textView', { static: false }) textView: ElementRef;
    _value: string = '';
    @Input() set value(v: string) {
        if (this._value !== v) {
            this._value = v;
            this.valueChange.emit(v);
        }
    }

    @Output() valueChange: EventEmitter<String> = new EventEmitter();

    subs: Subscription[] = [];

    get textElementRef(): ElementRef {
        return this.type === 'view' ? this.textView : this.textField;
    }

    constructor() {
        this.subs.push(this.valueChange.subscribe(v => this.label && v && this.onFocus()));
    }

    ngOnInit(): void {
        if (this.label && this.value) {
            this.onFocus();
        }
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub && sub.unsubscribe());
    }

    textChanged(event: string): void {
        this.valueChange.emit(event);
    }

    onFocus(): void {
        this.label.nativeElement.animate({
            translate: { x: 0, y: -25 },
            opacity: 1,
        });
    }

    onBlur(): void {
        const label: any = this.label.nativeElement;
        const textField: any = this.textElementRef.nativeElement;
        if (!textField.text) {
            label.animate({
                translate: { x: 0, y: 0 },
                opacity: 0.4,
            });
        }
    }
}
