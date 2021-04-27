Client.rooms.interface.furniture.logics.furniture_custom_stack_height = function(entity) {
    if(entity.dialog != undefined) {
        entity.dialog.show();

        return;
    }

    entity.dialog = new Dialog({
        title: entity.furniture.furniture.title,
        
        size: {
            width: 240,
            height: 120
        },

        offset: {
            type: "center"
        }
    });

    entity.dialog.events.destroy.push(function() {
        entity.dialog = undefined;
    });

    entity.dialog.show();
};
