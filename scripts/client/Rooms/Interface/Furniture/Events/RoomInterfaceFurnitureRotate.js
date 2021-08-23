Client.rooms.interface.furniture.rotate = new function() {
    this.start = async function(entity) {
        await SocketMessages.sendCall({
            OnRoomFurnitureRotate: {
                id: entity.data.id,
                direction: entity.furniture.getNextDirection()
            }
        }, "OnRoomFurnitureRotate", x => x.id == entity.data.id);
    };
};
