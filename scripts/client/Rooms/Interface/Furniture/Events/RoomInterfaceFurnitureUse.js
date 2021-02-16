Client.rooms.interface.furniture.use = new function() {
    this.start = async function(entity) {
        Client.socket.messages.send({ OnRoomFurnitureUse: entity.data.id });
    };
};
