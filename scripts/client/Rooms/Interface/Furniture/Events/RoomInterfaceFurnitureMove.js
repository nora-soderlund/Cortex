Client.rooms.interface.furniture.move = new function() {
    this.start = async function(entity) {
        entity.disable();

        Client.rooms.interface.furniture.place.start(entity.data.furniture, function(result) {
            if(result.entity.enabled == false) {
                result.stop();

                entity.enable();
    
                return;
            }
    
            result.unbind();
    
            Client.socket.messages.sendCall({
                OnRoomFurnitureMove: {
                    id: entity.data.id,
                    position: {
                        row: result.position.row,
                        column: result.position.column,
                        direction: result.entity.furniture.settings.direction
                    }
                }
            }, "OnRoomFurnitureMove", x => x == entity.data.id).then(function(response) {
                result.stop();

                entity.enable();

                entity.setCoordinates(result.position.row, result.position.column, result.position.depth);
            });
        }, entity.furniture.settings.direction);
    };
};
