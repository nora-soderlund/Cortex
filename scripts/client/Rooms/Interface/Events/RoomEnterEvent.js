Client.socket.messages.register("OnRoomEnter", async function(data) {
    Client.rooms.interface.entity.door = undefined;

    if(data.room.map.floor[data.room.map.door.row + 1] == undefined || data.room.map.floor[data.room.map.door.row + 1][data.room.map.door.column] == 'X')
        Client.rooms.interface.entity.door = data.room.map.door;

    Client.rooms.navigator.hide();

    await Client.rooms.interface.clear();

    Client.rooms.interface.data = data.room;
    Client.rooms.interface.data.user = data.user;

    Client.rooms.interface.map = new Client.rooms.items.map(Client.rooms.interface.entity, data.room.map.floor, data.room.map.door);
    
    Client.rooms.interface.map.render().then(function() {
        Client.rooms.interface.entity.addEntity(Client.rooms.interface.map);

        const width = Client.rooms.interface.$element.width(), height = Client.rooms.interface.$element.height();

        Client.rooms.interface.entity.setOffset((width / 2) - ((Client.rooms.interface.map.map.rows * 16) + (Client.rooms.interface.map.map.columns * 16)), (height / 2) - ((Client.rooms.interface.map.map.rows * 8) + (Client.rooms.interface.map.map.columns * 8)));
    });

    Client.rooms.interface.start();
});
