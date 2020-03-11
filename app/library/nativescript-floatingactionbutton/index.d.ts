import { Color } from '@nativescript/core/color';
import { View } from '@nativescript/core/ui/core/view';

export declare class Fab extends View {
    hideOnSwipeOfView: string;
    swipeAnimation: 'slideUp' | 'slideDown' | 'slideRight' | 'slideLeft' | 'scale';
    hideAnimationDuration: number;
    rippleColor: Color;
    icon: string;
}
