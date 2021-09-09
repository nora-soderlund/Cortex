RoomInterface.furniture.pickup = new function() {
    this.start = async function(entity) {
        entity.alpha = .5;

        const response = await SocketMessages.sendCall({ OnRoomFurniturePickup: entity.data.id }, "OnRoomFurniturePickup", x => x.id == entity.data.id);
    };
};
