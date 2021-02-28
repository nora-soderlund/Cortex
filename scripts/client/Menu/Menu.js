Client.menu = new function() {
    this.$element = $(
        '<div id="menu"></div>'
    ).appendTo(Client.$element);

    this.addItem = function(identifier, callback) {
        const $element = $(
            '<div class="menu-item">' +
                '<div class="menu-sprite menu-' + identifier + '"></div>' +
            '</div>'
        ).on("click", function() {
            callback();
        }).appendTo(this.$element);

        return $element;
    };

    this.addItem("navigator", function() {
        Client.rooms.navigator.toggle();
    });

    this.addItem("shop", function() {
        Client.shop.toggle();
    });

    const $inventory = this.addItem("inventory", function() {
        Client.inventory.toggle();
    });

    const $camera = this.addItem("camera", function() {
        Client.rooms.interface.camera.toggle();
    });

    Client.rooms.interface.events.start.push(function() {
        $inventory.show();
        $camera.show();
    });

    Client.rooms.interface.events.stop.push(function() {
        $camera.hide();
        $inventory.hide();
    });
};
