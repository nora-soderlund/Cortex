Client.rooms.interface.users = new function() {
    this.$name = $('<div class="room-interface-user"></div>').appendTo(Client.rooms.interface.$element);

    this.hover = function(entity) {
        if(entity == undefined || entity.entity.name != "figure") {
            this.$name.hide();

            return;
        }

        this.$name.html(
            '<div class="room-interface-user-title">' + entity.entity.data.name + '</div>' +
            
            '<div class="room-interface-user-arrow"></div>'
        );

        const center = Client.rooms.interface.entity.center;
        const position = Client.rooms.interface.entity.offset;

        const offset = entity.sprite.getOffset();

        this.$name.css({
            "left": center + position[0] + offset[0],
            "bottom": Client.rooms.interface.$element.height() - (position[1] + offset[1])
        }).show();
    };

    Client.rooms.interface.entity.events.render.push(function() {
        const entity = Client.rooms.interface.entity.currentEntity;

        Client.rooms.interface.users.hover(entity);
    });
};
