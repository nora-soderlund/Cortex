Client.socket.messages.register("OnRoomFurnitureVideoStart", function(data) {
    const entity = Client.rooms.interface.furnitures[data.id];

    if(entity == undefined)
        return;

    if(entity.video != undefined) {
        entity.video.image.pause();
    
        $(entity.video.image).remove();
    
        delete entity.video;
    }

    entity.video = new Client.rooms.items.video(entity, Client.loader.settings.api.youtube + data.link + ".mp4");

    entity.sprites.push(entity.video);
});

Client.socket.messages.register("OnRoomFurnitureVideoStop", function(data) {
    const entity = Client.rooms.interface.furnitures[data];

    if(entity == undefined)
        return;

    if(entity.video == undefined)
        return; 
});
