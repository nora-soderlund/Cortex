Client.dialogs.header = function() {
    this.$element = $('<div class="dialog-header"></div>');

    this.$image = $('<div class="dialog-header-image"></div>').appendTo(this.$element);

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

    this.setTitle = function(title) {
        this.$content.find(".dialog-header-title").html(title);
    };

    this.setDescription = function(description) {
        this.$content.find(".dialog-header-description").html(description);
    };

    this.setIcon = function($element) {
        const $icon = this.$content.find(".dialog-header-icon").css("min-width", "64px");
        
        $icon.html("");

        $element.appendTo($icon);
    };
};
