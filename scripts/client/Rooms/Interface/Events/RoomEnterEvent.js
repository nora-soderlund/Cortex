Client.socket.messages.register("OnRoomEnter", async function(data) {
    Client.rooms.navigator.hide();

    await Client.rooms.interface.clear();

    Client.rooms.interface.data = data;

    Client.rooms.interface.map = new Client.rooms.items.map(Client.rooms.interface.entity, data.map.floor, data.map.door);
    
    Client.rooms.interface.map.render().then(function() {
        Client.rooms.interface.entity.addEntity(Client.rooms.interface.map);

        const width = Client.rooms.interface.$element.width(), height = Client.rooms.interface.$element.height();

        Client.rooms.interface.entity.setOffset((width / 2) - ((Client.rooms.interface.map.map.rows * 16) + (Client.rooms.interface.map.map.columns * 16)), (height / 2) - ((Client.rooms.interface.map.map.rows * 8) + (Client.rooms.interface.map.map.columns * 8)));
    });

    Client.rooms.interface.start();
});
