SocketMessages.register("OnRoomSettingsUpdate", function(data) {
    for(let key in data)
        Client.rooms.interface.data[key] = data[key];
        
    if(data.map != undefined || data.floor_material != undefined || data.wall_material != undefined) {
        if(Client.rooms.interface.map != undefined)
            Client.rooms.interface.entity.removeEntity(Client.rooms.interface.map);

        Client.rooms.interface.map = new Client.rooms.items.map(Client.rooms.interface.entity, Client.rooms.interface.data.map.floor, Client.rooms.interface.data.map.door, {
            thickness: Client.rooms.interface.data.floor_thickness,
            material: Client.rooms.interface.data.floor_material
        }, {
            thickness: Client.rooms.interface.data.wall_thickness,
            material: Client.rooms.interface.data.wall_material
        });

        Client.rooms.interface.map.render().then(function() {
            Client.rooms.interface.entity.addEntity(Client.rooms.interface.map);
        });
    }
});
