Client.rooms.interface.furniture.logics.furniture_multistate = async function(entity) {
    const animation = entity.furniture.getNextAnimation();

    await Client.socket.messages.sendCall({
        OnRoomFurnitureUse: {
            id: entity.data.id,
            animation
        }
    }, "OnRoomFurnitureUse", x => x == entity.data.id);

    entity.furniture.setAnimation(animation);
};
