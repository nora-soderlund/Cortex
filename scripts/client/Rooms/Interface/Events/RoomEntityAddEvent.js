Client.socket.messages.register("OnRoomEntityAdd", function(data) {
    if(data.furnitures != undefined) {
        if(data.furnitures.length == undefined)
            data.furnitures = [ data.furnitures ];

        for(let index in data.furnitures) {
            let entity = new Client.rooms.items.furniture(Client.rooms.interface.entity, "HabboFurnitures/Club/Sofa", data.furnitures[index].position.direction);
            
            entity.setPosition(data.furnitures[index].position);
            
            entity.render();

            Client.rooms.interface.entity.addEntity(entity);
        }
    }
    
    if(data.users != undefined) {
        if(data.users.length == undefined)
            data.users = [ data.users ];

        for(let index in data.users) {
            let entity = new Client.rooms.items.figure(Client.rooms.interface.entity, data.users[index].figure, data.users[index].position.direction);
            
            entity.setPosition(data.users[index].position);
            
            entity.render();

            entity.data = data.users[index];

            Client.rooms.interface.entity.addEntity(entity);

            Client.rooms.interface.users[data.users[index].id] = entity;
        }
    }
});
