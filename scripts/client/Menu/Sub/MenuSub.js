Client.menu.sub = new function() {
    this.$element = $('<div class="menu-sub"></div>').appendTo(Client.$element);

    this.addItem = function(sprite, click) {
        const $element = $(
            '<div class="menu-sub-item">' +
                '<div class="menu-sub-sprite sprite-' + sprite + '"></div>' +
            '</div>'
        ).appendTo(this.$element);

        $element.on("click", click);
    };

    this.addItem("menu-sub-achievements", function() {
        
    });
};
