'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var core_1 = require('@nativescript/core');
var image_source_1 = require('@nativescript/core/image-source');
var view_1 = require('@nativescript/core/ui/core/view');
var fab_common_1 = require('./fab-common');
var FABNamespace = useAndroidX() ? com.google.android.material.floatingactionbutton : android.support.design.widget;
function useAndroidX() {
    return global.androidx && com.google && com.google.android && com.google.android.material;
}
var Fab = (function(_super) {
    __extends(Fab, _super);
    function Fab() {
        return (_super !== null && _super.apply(this, arguments)) || this;
    }
    Object.defineProperty(Fab.prototype, 'android', {
        get: function() {
            return this.nativeView;
        },
        enumerable: true,
        configurable: true,
    });
    Fab.prototype.createNativeView = function() {
        this._android = new FABNamespace.FloatingActionButton(this._context);
        return this._android;
    };
    Fab.prototype.initNativeView = function() {
        this._androidViewId = android.view.View.generateViewId();
        this.nativeView.setId(this._androidViewId);
        initializeClickListener();
        var clickListener = new ClickListener(this);
        this.nativeView.setOnClickListener(clickListener);
        this.nativeView.clickListener = clickListener;
        this.android.setScaleType(android.widget.ImageView.ScaleType.CENTER_INSIDE);
    };
    Fab.prototype[view_1.backgroundColorProperty.getDefault] = function() {
        return this.nativeView.getBackgroundTintList();
    };
    Fab.prototype[view_1.backgroundColorProperty.setNative] = function(value) {
        var newValue;
        if (value instanceof core_1.Color) {
            newValue = android.content.res.ColorStateList.valueOf(value.android);
        } else {
            newValue = value;
        }
        try {
            this.nativeView.setBackgroundTintList(newValue);
        } catch (err) {
            console.log('Error setNative backgroundColorProperty: ', err);
        }
    };
    Fab.prototype[view_1.backgroundInternalProperty.setNative] = function(value) {};
    Fab.prototype[fab_common_1.rippleColorProperty.setNative] = function(value) {
        this.nativeView.setRippleColor(value.android);
    };
    Fab.prototype[fab_common_1.iconProperty.setNative] = function(value) {
        var iconDrawable = null;
        if (!value) {
            return;
        }
        if (image_source_1.isFileOrResourcePath(value)) {
            iconDrawable = image_source_1.ImageSource.fromFileOrResourceSync(value);
            if (iconDrawable) {
                this.nativeView.setImageBitmap(iconDrawable.android);
            } else {
                console.log(
                    'The icon: ' +
                        value +
                        ' was not found. Check your icon property value. Be sure to rebuild the project after adding images.'
                );
            }
        } else {
            var drawableId = android.content.res.Resources.getSystem().getIdentifier(value, 'drawable', 'android');
            iconDrawable = android.content.res.Resources.getSystem().getDrawable(drawableId);
            if (iconDrawable) {
                this.nativeView.setImageDrawable(iconDrawable);
            } else {
                console.log(
                    'The icon: ' +
                        value +
                        ' was not found. Check your icon property value. Be sure to rebuild the project after adding images.'
                );
            }
        }
    };
    Fab.prototype[fab_common_1.textProperty.setNative] = function(value) {
        var image = this.getImageFromText(value);
        this.nativeView.setImageBitmap(image.android);
    };
    Fab.tapEvent = 'tap';
    return Fab;
})(fab_common_1.FloatingActionButtonBase);
exports.Fab = Fab;
var ClickListener;
function initializeClickListener() {
    if (ClickListener) {
        return;
    }
    var ClickListenerImpl = (function(_super) {
        __extends(ClickListenerImpl, _super);
        function ClickListenerImpl(owner) {
            var _this = _super.call(this) || this;
            _this.owner = owner;
            return global.__native(_this);
        }
        ClickListenerImpl.prototype.onClick = function(v) {
            var owner = this.owner;
            if (owner) {
                owner._emit('tap');
            }
        };
        ClickListenerImpl = __decorate(
            [
                Interfaces([android.view.View.OnClickListener]),
                __metadata('design:paramtypes', [fab_common_1.FloatingActionButtonBase]),
            ],
            ClickListenerImpl
        );
        return ClickListenerImpl;
    })(java.lang.Object);
    ClickListener = ClickListenerImpl;
}
//# sourceMappingURL=fab.android.js.map
