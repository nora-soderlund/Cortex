Client.socket.messages.register("OnRoomEnter", async function(data) {
    Client.rooms.navigator.hide();

    await Client.rooms.interface.clear();

    Client.rooms.interface.floormap = new Client.rooms.items.floormap(Client.rooms.interface.entity, data.map.floor, "301", 8);
    
    Client.rooms.interface.floormap.render().then(function() {
        Client.rooms.interface.entity.addEntity(Client.rooms.interface.floormap);

        const width = Client.rooms.interface.$element.width(), height = Client.rooms.interface.$element.height();

        Client.rooms.interface.entity.setOffset((width / 2) - ((Client.rooms.interface.floormap.floormap.rows * 16) + (Client.rooms.interface.floormap.floormap.columns * 16)), (height / 2) - ((Client.rooms.interface.floormap.floormap.rows * 8) + (Client.rooms.interface.floormap.floormap.columns * 8)));
    });

    Client.rooms.interface.start();
});
