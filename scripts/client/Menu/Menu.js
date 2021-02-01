Client.menu = new function() {
    this.$element = $(
        '<div id="menu"></div>'
    ).appendTo(Client.$element);

    this.addItem = function(identifier, callback) {
        const $element = $(
            '<div class="menu-item">' +
                '<div class="menu-' + identifier + '"></div>' +
            '</div>'
        ).on("click", function() {
            callback();
        }).appendTo(this.$element);
    };

    this.addItem("navigator", function() {
        Client.rooms.navigator.toggle();
    });
};
