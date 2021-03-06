'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var ImageSource = require('@nativescript/core/image-source');
var fab_common_1 = require('./fab-common');
var Fab = (function(_super) {
    __extends(Fab, _super);
    function Fab() {
        var _this = _super.call(this) || this;
        var btn = MNFloatingActionButton.alloc().init();
        btn.animationScale = 0.95;
        _this.nativeView = btn;
        return _this;
    }
    Fab.prototype.setImage = function(iconDrawable) {
        var newImageView = UIImageView.alloc().initWithImage(iconDrawable.ios);
        if (newImageView !== null) {
            var button = this.nativeView.subviews[0];
            var oldBadImageView = button.subviews[0];
            oldBadImageView.removeFromSuperview();
            button.addSubview(newImageView);
        }
    };
    Fab.prototype[fab_common_1.iconProperty.setNative] = function(value) {
        var iconDrawable = null;
        if (ImageSource.isFileOrResourcePath(value)) {
            iconDrawable = ImageSource.fromFileOrResource(value);
        } else {
            iconDrawable = ImageSource.fromBase64(
                'iVBORw0KGgoAAAANSUhEUgAAAJAAAACQAQAAAADPPd8VAAAAAnRSTlMAAHaTzTgAAAAqSURBVHgBY6AMjIJRYP9n0AuNCo0KMf+HgwPDTmgoRMeo0KgQRWAUjAIABsnZRR7bYyUAAAAASUVORK5CYII='
            );
        }
        this.setImage(iconDrawable);
    };
    Fab.prototype[fab_common_1.textProperty.setNative] = function(value) {
        var image = this.getImageFromText(value);
        this.setImage(image);
    };
    Fab.prototype.onLayout = function(left, top, right, bottom) {
        _super.prototype.onLayout.call(this, left, top, right, bottom);
        this._centerIcon();
    };
    Fab.prototype._centerIcon = function() {
        var frame = this.nativeView.frame;
        var width = frame.size.width;
        var height = frame.size.height;
        var button = this.nativeView.subviews[0];
        var imageView = button.subviews[0];
        imageView.contentMode = 1;
        imageView.frame = CGRectMake(0, 0, width / 2, height / 2);
        imageView.center = CGPointMake(width / 2, height / 2);
    };
    return Fab;
})(fab_common_1.FloatingActionButtonBase);
exports.Fab = Fab;
//# sourceMappingURL=fab.ios.js.map
