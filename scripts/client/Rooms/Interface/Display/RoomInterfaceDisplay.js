Client.rooms.interface.display = new function() {
    this.$element = $(
        '<div class="room-interface-display">' +
            '<div class="room-interface-display-content"></div>' +

            '<div class="room-interface-display-buttons"></div>' + 
        '</div>'
    ).hide().appendTo(Client.rooms.interface.$element);

    this.$content = this.$element.find(".room-interface-display-content");
    this.$buttons = this.$element.find(".room-interface-display-buttons");

    this.addButton = function(text, click) {
        const $element = $('<div class="room-interface-display-button">' + text + '</div>').appendTo(this.$buttons);
+
        $element.click(click);
    };

    this.furniture = async function(entity) {
        this.$element.hide();

        this.$content.html("");
        this.$buttons.html("");

        const furniture = await Client.furnitures.get(entity.furniture.settings.id);

        const $header = $('<div class="room-interface-display-title">' + furniture.title + '</div>').appendTo(this.$content);

        $('<div class="room-interface-display-break"></div>').appendTo(this.$content);

        const $canvas = $('<canvas class="room-interface-display-canvas"></canvas>').appendTo(this.$content);

        if(furniture.description.length != 0) {
            $('<div class="room-interface-display-break"></div>').appendTo(this.$content);

            $('<div class="room-interface-display-description">' + furniture.description + '</div>').appendTo(this.$content);
        }

        new Client.furnitures.renderer({ id: furniture.id, direction: 4 }, $canvas, "rgb(28, 28, 26)");

        this.addButton("Pickup", function() {
            Client.rooms.interface.furniture.pickup.start(entity);
        });

        this.addButton("Rotate", function() {

        });
        
        this.addButton("Move", function() {
            Client.rooms.interface.furniture.move.start(entity);
        });

        if(Client.rooms.interface.furniture.logics[entity.furniture.types.logic] != undefined) {
            this.addButton("Use", function() {
                Client.rooms.interface.furniture.use.start(entity);
            });
        }

        this.$element.show();
    };

    Client.rooms.interface.cursor.events.click.push(function(entity) {
        if(entity == undefined) {
            Client.rooms.interface.display.$element.hide();
            
            return;
        }

        switch(entity.entity.name) {
            case "furniture":
                Client.rooms.interface.display.furniture(entity.entity);

                break;
        }
    });
};
