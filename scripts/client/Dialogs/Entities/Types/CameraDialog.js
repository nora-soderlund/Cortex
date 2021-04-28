class CameraDialog extends Dialog {
    create() {
        super.create();

        this.$element.addClass("dialog-camera");

        this.$grid = $('<div class="dialog-camera-grid"></div>').appendTo(this.$content);
    };
};
