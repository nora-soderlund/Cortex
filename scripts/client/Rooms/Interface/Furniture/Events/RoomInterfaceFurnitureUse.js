Client.rooms.interface.furniture.use = new function() {
    this.start = async function(entity) {
        if(entity.furniture.types.logic == "furniture_multistate") {
            const animation = entity.furniture.getNextAnimation();

            await Client.socket.messages.sendCall({
                OnRoomFurnitureUse: {
                    id: entity.data.id,
                    animation
                }
            }, "OnRoomFurnitureUse", x => x == entity.data.id);

            entity.furniture.setAnimation(animation);
        }
    };
};
