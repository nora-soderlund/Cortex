Client.socket.messages.register("OnRoomFurnitureVideoStart", function(data) {
    const entity = Client.rooms.interface.furnitures[data.id];

    if(entity == undefined)
        return;

    entity.video = new Client.rooms.items.video(entity, data.link);
});

Client.socket.messages.register("OnRoomFurnitureVideoStop", function(data) {
    const entity = Client.rooms.interface.furnitures[data];

    if(entity == undefined)
        return;

    if(entity.video == undefined)
        return;

    entity.video.image.pause();

    $(entity.video.image).remove();

    delete entity.video;
});
