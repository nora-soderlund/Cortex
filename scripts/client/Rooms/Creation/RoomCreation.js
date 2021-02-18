Client.rooms.creation = new function() {
    const entity = new Client.dialogs.default({
        title: "Room Creation",
        
        size: {
            width: 580,
            height: 310
        },

        offset: {
            type: "center"
        }
    });

    entity.events.create.push(function() {
        entity.$content.addClass("room-creation");
        
        entity.$grid = $('<div class="room-creation-grid"></div>').appendTo(entity.$content);
        
        entity.$buttons = $(
            '<div class="room-creation-buttons">' +
                '<div class="dialog-button">Next step</div>' +
                '<div class="dialog-button disabled">Previous step</div>' +
            '</div>'
        ).appendTo(entity.$content);
    });

    entity.showProperties = function() {
        const $information = $('<div class="room-creation-information"></div>').appendTo(entity.$grid);

        $(
            '<div class="room-creation-property">' +
                '<p>' +
                    '<b>Room Name</b>' +
                    '<span>Give your room a fun and interesting title, this is what interests others!</span>' + 
                '</p>' +
                
                '<div class="input-pen">' +
                    '<input type="text" placeholder="Enter a room name...">' +
                '</div>' + 
            '</div>'
        ).appendTo($information);

        $(
            '<div class="room-creation-property">' +
                '<p>' +
                    '<b>Room Description</b>' +
                    '<span>Describe what your room is, what can others do in your room, let them know what it is!</span>' + 
                '</p>' +
                
                '<div class="textarea-pen">' +
                    '<textarea type="text" placeholder="Enter a room name..."></textarea>' +
                '</div>' + 
            '</div>'
        ).appendTo($information);

        $(
            '<div class="room-creation-property">' +
                '<p>' +
                    '<b>Room Category</b>' +
                    '<span>What category does your room fall into?</span>' + 
                '</p>' +
                
                '<input type="text" value="Chill rooms thingy thing">' +
            '</div>'
        ).appendTo($information);
    };

    entity.events.show.push(function() {
        Client.rooms.navigator.hide();
        
        entity.showProperties();
    });

    return entity;
};

Client.rooms.creation.show();
