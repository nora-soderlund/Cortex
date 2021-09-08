class DialogHeader {
    constructor(settings = {}) {
        this.$element = $('<div class="dialog-header"></div>');

        this.$image = $('<canvas class="dialog-header-image"></canvas>').appendTo(this.$element);

        this.$content = $(
            '<div class="dialog-header-container">' +
                '<div class="dialog-header-content">' +
                    '<div class="dialog-header-icon"></div>' +
                    '<div class="dialog-header-details">' +
                        '<h1 class="dialog-header-title"></h1>' +
                        '<p class="dialog-header-description"></p>' +
                    '</div>' +
                '</div>' +
            '</div>'
        ).appendTo(this.$element);

        this.set(settings);
    };

    setTitle(title) {
        this.$content.find(".dialog-header-title").html(title);
    };

    setDescription(description) {
        this.$content.find(".dialog-header-description").html(description);
    };

    getContext(context) {
        this.$image.attr({
            width: this.$image.parent().width(),
            height: this.$image.parent().height()
        });

        return this.$image[0].getContext(context);
    };

    setIcon($element) {
        const $icon = this.$content.find(".dialog-header-icon").css("min-width", "64px");
        
        $icon.html("");

        $element.appendTo($icon);
    };

    set(settings) {
        if(settings.height != undefined)
            this.$element.css("height", settings.height);
    };
};
