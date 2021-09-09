SocketMessages.register("OnRoomSettingsUpdate", function(data) {
    for(let key in data)
        RoomInterface.data[key] = data[key];
        
    if(data.map != undefined || data.floor_material != undefined || data.wall_material != undefined) {
        if(RoomInterface.map != undefined)
            RoomInterface.entity.removeEntity(RoomInterface.map);

        RoomInterface.map = new Client.rooms.items.map(RoomInterface.entity, RoomInterface.data.map.floor, RoomInterface.data.map.door, {
            thickness: RoomInterface.data.floor_thickness,
            material: RoomInterface.data.floor_material
        }, {
            thickness: RoomInterface.data.wall_thickness,
            material: RoomInterface.data.wall_material
        });

        RoomInterface.map.render().then(function() {
            RoomInterface.entity.addEntity(RoomInterface.map);
        });
    }
});
