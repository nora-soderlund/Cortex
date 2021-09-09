RoomInterface.furniture.logics.furniture_multistate = async function(entity) {
    const animation = entity.furniture.getNextAnimation();

    await SocketMessages.sendCall({
        OnRoomFurnitureUse: {
            id: entity.data.id,
            animation
        }
    }, "OnRoomFurnitureUse", x => x == entity.data.id);

    entity.furniture.setAnimation(animation);
};
