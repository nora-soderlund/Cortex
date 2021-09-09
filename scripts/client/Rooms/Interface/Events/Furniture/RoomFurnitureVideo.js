SocketMessages.register("OnRoomFurnitureVideoStart", function(data) {
    const entity = RoomInterface.furnitures[data.id];

    if(entity == undefined)
        return;

    if(entity.video != undefined) {
        entity.video.image.pause();
    
        $(entity.video.image).remove();
    
        delete entity.video;
    }

    entity.video = new Client.rooms.items.video(entity, Loader.settings.api.youtube + data.video + ".mp4", (data.time == undefined)?(0):(data.time));

    entity.sprites.push(entity.video);
});

SocketMessages.register("OnRoomFurnitureVideoStop", function(data) {
    const entity = RoomInterface.furnitures[data];

    if(entity == undefined)
        return;

    if(entity.video == undefined)
        return; 
        
    entity.video.image.pause();

    $(entity.video.image).remove();

    delete entity.video;
});
