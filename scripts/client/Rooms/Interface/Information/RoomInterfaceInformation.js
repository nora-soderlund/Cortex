RoomInterface.information = new function() {
    const entity = new Dialog({
        title: "Room Information",
        
        size: {
            width: 240
        },

        offset: {
            type: "center",

            top: -120
        }
    });

    entity.events.create.push(function() {
        entity.$content.addClass("room-interface-information");
        
        entity.$title = $('<p class="room-interface-information-title"></p>').appendTo(entity.$content);

        entity.$owner = $('<p class="room-interface-information-owner"></p>').appendTo(entity.$content);

        entity.$description = $('<p class="room-interface-information-description"></p>').appendTo(entity.$content);

        entity.$thumbnail = $('<div class="room-interface-information-thumbnail"></div>').appendTo(entity.$content);
    });

    entity.events.show.push(function() {
        entity.$title.text(RoomInterface.data.title);
        entity.$owner.text("");
        entity.$description.text((RoomInterface.data.description == undefined)?(""):(RoomInterface.data.description));

        Game.getUser(RoomInterface.data.user).then(function(user) {
            entity.$owner.text("By " + user.name);
        });
    });

    RoomInterface.events.stop.push(function() {
        if(entity.active)
            entity.hide();
    });

    return entity;
};
