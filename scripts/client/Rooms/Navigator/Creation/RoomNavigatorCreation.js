Client.rooms.navigator.creation = new function() {
    const entity = new Client.dialogs.default({
        title: "Room Creation",
        
        size: {
            width: 580,
            height: 330
        },

        offset: {
            type: "center"
        }
    });

    entity.events.create.push(function() {
    });

    entity.events.show.push(function() {
        Client.rooms.navigator.hide();
    });

    return entity;
};
