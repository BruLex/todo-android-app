"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var color_1 = require("@nativescript/core/color");
var image_source_1 = require("@nativescript/core/image-source");
var view_1 = require("@nativescript/core/ui/core/view");
var font_1 = require("@nativescript/core/ui/styling/font");
var FloatingActionButtonBase = (function (_super) {
    __extends(FloatingActionButtonBase, _super);
    function FloatingActionButtonBase() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.swipeEventAttached = false;
        return _this;
    }
    FloatingActionButtonBase.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        if (this.swipeEventAttached === false) {
            var fab_1 = this;
            if (this.hideOnSwipeOfView) {
                var parent_1 = this.parent || this.parentNode;
                var swipeItem = parent_1.getViewById(this.hideOnSwipeOfView);
                if (!swipeItem) {
                    return;
                }
                var animationType_1 = this.swipeAnimation
                    ? this.swipeAnimation
                    : 'slideDown';
                if (swipeItem !== undefined) {
                    var duration_1 = this.hideAnimationDuration
                        ? this.hideAnimationDuration
                        : this._getDurationDefault(animationType_1);
                    swipeItem.on('pan', function (args) {
                        if (args.deltaY < -10) {
                            switch (animationType_1) {
                                case 'slideUp':
                                    try {
                                        fab_1.animate({
                                            target: fab_1,
                                            translate: {
                                                x: 0,
                                                y: -200
                                            },
                                            opacity: 0,
                                            duration: 400
                                        });
                                    }
                                    catch (error) {
                                        console.log(error);
                                    }
                                    break;
                                case 'slideDown':
                                    fab_1.animate({
                                        target: fab_1,
                                        translate: {
                                            x: 0,
                                            y: 200
                                        },
                                        opacity: 0,
                                        duration: duration_1
                                    });
                                    break;
                                case 'slideRight':
                                    fab_1.animate({
                                        target: fab_1,
                                        translate: {
                                            x: 200,
                                            y: 0
                                        },
                                        opacity: 0,
                                        duration: duration_1
                                    });
                                    break;
                                case 'slideLeft':
                                    fab_1.animate({
                                        target: fab_1,
                                        translate: {
                                            x: -200,
                                            y: 0
                                        },
                                        opacity: 0,
                                        duration: duration_1
                                    });
                                    break;
                                case 'scale':
                                    fab_1.animate({
                                        target: fab_1,
                                        scale: {
                                            x: 0,
                                            y: 0
                                        },
                                        duration: duration_1
                                    });
                                    break;
                            }
                        }
                        else if (args.deltaY > 0) {
                            switch (animationType_1) {
                                case 'slideUp':
                                    fab_1.animate({
                                        target: fab_1,
                                        translate: {
                                            x: 0,
                                            y: 0
                                        },
                                        opacity: 1,
                                        duration: duration_1
                                    });
                                    break;
                                case 'slideDown':
                                    fab_1.animate({
                                        target: fab_1,
                                        translate: {
                                            x: 0,
                                            y: 0
                                        },
                                        opacity: 1,
                                        duration: duration_1
                                    });
                                    break;
                                case 'slideRight':
                                    fab_1.animate({
                                        target: fab_1,
                                        translate: {
                                            x: 0,
                                            y: 0
                                        },
                                        opacity: 1,
                                        duration: duration_1
                                    });
                                    break;
                                case 'slideLeft':
                                    fab_1.animate({
                                        target: fab_1,
                                        translate: {
                                            x: 0,
                                            y: 0
                                        },
                                        opacity: 1,
                                        duration: duration_1
                                    });
                                    break;
                                case 'scale':
                                    fab_1.animate({
                                        target: fab_1,
                                        scale: {
                                            x: 1,
                                            y: 1
                                        },
                                        duration: duration_1
                                    });
                                    break;
                            }
                        }
                    });
                    this.swipeEventAttached = true;
                }
            }
        }
    };
    FloatingActionButtonBase.prototype._getDurationDefault = function (animationType) {
        switch (animationType) {
            case 'scale':
                return 200;
            default:
                return 400;
        }
    };
    FloatingActionButtonBase.prototype.getImageFromText = function (value) {
        var font = new font_1.Font(this.style.fontFamily || 'normal', this.style.fontSize || 16, this.style.fontStyle || font_1.FontStyle.NORMAL, this.style.fontWeight || font_1.FontWeight.LIGHT);
        var color = this.style.color || new color_1.Color('#FFFFFF');
        var source = new image_source_1.ImageSource();
        source.loadFromFontIconCode(value, font, color);
        return source;
    };
    return FloatingActionButtonBase;
}(view_1.View));
exports.FloatingActionButtonBase = FloatingActionButtonBase;
exports.iconProperty = new view_1.Property({
    name: 'icon',
    affectsLayout: true
});
exports.iconProperty.register(FloatingActionButtonBase);
exports.textProperty = new view_1.Property({
    name: 'text',
    affectsLayout: true
});
exports.textProperty.register(FloatingActionButtonBase);
exports.rippleColorProperty = new view_1.Property({
    name: 'rippleColor',
    equalityComparer: color_1.Color.equals,
    valueConverter: function (v) { return new color_1.Color(v); }
});
exports.rippleColorProperty.register(FloatingActionButtonBase);
//# sourceMappingURL=fab-common.js.map