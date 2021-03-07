Client.rooms.interface.furniture.logics.furniture_dice = async function(entity, sprite) {
    const tag = (sprite == undefined)?(undefined):(sprite.tag);

    await Client.socket.messages.sendCall({
        OnRoomFurnitureUse: {
            id: entity.data.id, tag
        }
    }, "OnRoomFurnitureUse", x => x == entity.data.id);
};
