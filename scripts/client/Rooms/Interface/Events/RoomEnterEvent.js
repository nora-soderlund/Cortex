SocketMessages.register("OnRoomEnter", async function(data) {
    RoomInterface.entity.door = undefined;

    if(data.map.floor[data.map.door.row + 1] == undefined || data.map.floor[data.map.door.row + 1][data.map.door.column] == 'X')
        RoomInterface.entity.door = data.map.door;

    Client.rooms.navigator.hide();

    await RoomInterface.clear();

    RoomInterface.data = data;

    SocketMessages.sendCall({ OnRoomMapStackUpdate: null }, "OnRoomMapStackUpdate").then(function(result) {
        RoomInterface.data.map.stack = result;
    });

    RoomInterface.map = new Client.rooms.items.map(RoomInterface.entity, data.map.floor, data.map.door, {
        thickness: data.floor_thickness,
        material: data.floor_material
    }, {
        thickness: data.wall_thickness,
        material: data.wall_material
    });
    
    RoomInterface.map.render().then(function() {
        RoomInterface.entity.addEntity(RoomInterface.map);

        const width = RoomInterface.element.clientWidth, height = RoomInterface.element.clientHeight;

        RoomInterface.entity.offset = [
            (width / 2) - ((RoomInterface.map.map.rows * 16) + (RoomInterface.map.map.columns * 16)),
            (height / 2) - ((RoomInterface.map.map.rows * 8) + (RoomInterface.map.map.columns * 8))
        ];

        console.log(RoomInterface.entity.offset);
    });

    RoomInterface.start();
});
