Client.socket.messages.register("OnRoomMapUpdate", function(data) {
    if(Client.rooms.interface.map != undefined)
        Client.rooms.interface.entity.removeEntity(Client.rooms.interface.map);

    Client.rooms.interface.data.map = data;

    Client.rooms.interface.map = new Client.rooms.items.map(Client.rooms.interface.entity, data.floor, "301", 8);

    Client.rooms.interface.map.render().then(function() {
        Client.rooms.interface.entity.addEntity(Client.rooms.interface.map);
    });
});
