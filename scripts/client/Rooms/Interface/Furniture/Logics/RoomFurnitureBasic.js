RoomInterface.furniture.logics.furniture_basic = async function(entity, sprite) {
    const tag = (sprite == undefined)?(undefined):(sprite.tag);

    await SocketMessages.sendCall({
        OnRoomFurnitureUse: {
            id: entity.data.id, tag
        }
    }, "OnRoomFurnitureUse", x => x == entity.data.id);
};
