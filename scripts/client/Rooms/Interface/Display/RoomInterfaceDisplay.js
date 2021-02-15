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

        console.log(entity);

        new Client.furnitures.renderer({ id: furniture.id, direction: 4 }, $canvas);

        this.addButton("Pickup", function() {
            Client.rooms.interface.furniture.pickup.start(entity);
        });

        this.addButton("Rotate", function() {

        });
        
        this.addButton("Move", function() {
            Client.rooms.interface.furniture.move.start(entity);
        });

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
