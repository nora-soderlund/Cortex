Client.socket.messages.register("OnRoomEnter", function(data) {
    Client.rooms.navigator.hide();

    Client.rooms.interface.clear();

    Client.rooms.interface.floormap = new Client.rooms.items.floormap(Client.rooms.interface.entity, data.map.floor, "301", 8);
    
    Client.rooms.interface.floormap.render().then(function() {
        Client.rooms.interface.entity.addEntity(Client.rooms.interface.floormap);

        const width = Client.rooms.interface.$element.width(), height = Client.rooms.interface.$element.height();

        Client.rooms.interface.entity.setOffset((width / 2) - (Client.rooms.interface.floormap.floormap.rows * 32), (height / 2) - ((Client.rooms.interface.floormap.floormap.rows * 8) + (Client.rooms.interface.floormap.floormap.columns * 8)));
    });

    Client.rooms.interface.start();
});
