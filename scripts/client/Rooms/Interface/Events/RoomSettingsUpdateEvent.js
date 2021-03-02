Client.socket.messages.register("OnRoomSettingsUpdate", function(data) {
    if(data.map != undefined) {
        if(Client.rooms.interface.map != undefined)
            Client.rooms.interface.entity.removeEntity(Client.rooms.interface.map);

        Client.rooms.interface.map = new Client.rooms.items.map(Client.rooms.interface.entity, data.map.floor, "301", 8);

        Client.rooms.interface.map.render().then(function() {
            Client.rooms.interface.entity.addEntity(Client.rooms.interface.map);
        });
    }

    for(let key in data)
        Client.rooms.interface.data[key] = data[key];
});
