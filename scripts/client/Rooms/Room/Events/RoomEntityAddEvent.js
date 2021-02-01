Client.socket.messages.register("OnRoomEntityAdd", function(data) {
    if(data.furnitures != undefined) {
        if(data.furnitures.length == undefined)
            data.furnitures = [ data.furnitures ];

        for(let index in data.furnitures) {
            let entity = new Client.rooms.items.furniture(Client.room.entity, "HabboFurnitures/Club/Sofa", data.furnitures[index].position.direction);
            
            entity.setPosition(data.furnitures[index].position);
            
            entity.render();

            Client.room.entity.addEntity(entity);
        }
    }
    
    if(data.users != undefined) {
        if(data.users.length == undefined)
            data.users = [ data.users ];

        for(let index in data.users) {
            let entity = new Client.rooms.items.figure(Client.room.entity, data.users[index].figure, data.users[index].position.direction);
            
            entity.setPosition(data.users[index].position);
            
            entity.render();

            entity.data = data.users[index];

            Client.room.entity.addEntity(entity);

            Client.room.users[data.users[index].id] = entity;
        }
    }
});
