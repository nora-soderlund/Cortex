Client.menu = new function() {
    this.$element = $(
        '<div id="menu"></div>'
    ).appendTo(Client.$element);

    this.$icons = $('<div class="menu-items"></div>').appendTo(this.$element);

    this.addItem = function(identifier, callback) {
        const $element = $(
            '<div class="menu-item">' +
                '<div class="menu-sprite menu-' + identifier + '"></div>' +
            '</div>'
        ).on("click", function() {
            callback();
        }).appendTo(this.$icons);

        return $element;
    };

    this.addItem("navigator", function() {
        Client.rooms.navigator.toggle();
    });

    this.addItem("shop", function() {
        Client.shop.toggle();
    });

    const $inventory = this.addItem("inventory", function() {
        Inventory.toggle();
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

Client.loader.ready(function() {
    const $user = Client.menu.addItem("user", function() {
        Client.menu.sub.$element.toggle();
    });

    const $canvas = $('<div class="menu-sprite menu-user"></div>');

    $user.html($canvas);
    
    const entity = new FigureEntity(Client.user.figure);
    
    SocketMessages.register("OnUserUpdate", function(data) {
        if(data.figure == undefined)
            return;

        entity.setFigure(data.figure);

        entity.render();
    });

    entity.events.render.push(function() {
        $canvas.html(entity.$canvas);
    });

    entity.process().then(function() {
        entity.render();
    });
});
