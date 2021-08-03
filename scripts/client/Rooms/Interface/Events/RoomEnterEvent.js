Client.socket.messages.register("OnRoomEnter", async function(data) {
    Client.rooms.interface.entity.door = undefined;

    if(data.map.floor[data.map.door.row + 1] == undefined || data.map.floor[data.map.door.row + 1][data.map.door.column] == 'X')
        Client.rooms.interface.entity.door = data.map.door;

    Client.rooms.navigator.hide();

    await Client.rooms.interface.clear();

    Client.rooms.interface.data = data;

    Client.socket.messages.sendCall({ OnRoomMapStackUpdate: null }, "OnRoomMapStackUpdate").then(function(result) {
        Client.rooms.interface.data.map.stack = result;
    });

    Client.rooms.interface.map = new RoomMapItem(Client.rooms.interface.entity, data.map.floor, data.map.door, {
        thickness: data.floor_thickness,
        material: data.floor_material
    }, {
        thickness: data.wall_thickness,
        material: data.wall_material
    });
    
    Client.rooms.interface.map.on("ready", () => {
        Client.rooms.interface.entity.addEntity(Client.rooms.interface.map);

        const width = Client.rooms.interface.$element.width(), height = Client.rooms.interface.$element.height();

        Client.rooms.interface.entity.offset = {
            left: (width / 2) - ((Client.rooms.interface.map.map.rows * 16) + (Client.rooms.interface.map.map.columns * 16)),
            top: (height / 2) - ((Client.rooms.interface.map.map.rows * 8) + (Client.rooms.interface.map.map.columns * 8))
        };
    });

    Client.rooms.interface.start();
});
