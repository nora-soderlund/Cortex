SocketMessages.register("OnRoomEntityAdd", async function(data) {
    if(data.furnitures != undefined) {
        if(data.furnitures.length == undefined)
            data.furnitures = [ data.furnitures ];

        for(let index in data.furnitures) {
            const dataFurniture = data.furnitures[index];
            
            let entity = new Client.rooms.items.furniture(RoomInterface.entity, dataFurniture.furniture, dataFurniture.position.direction);
            
            entity.setPosition(dataFurniture.position);

            if(dataFurniture.animation)
                entity.furniture.update({ animation: dataFurniture.animation });
            
            entity.render();

            entity.data = data.furnitures[index];

            RoomInterface.entity.addEntity(entity);

            RoomInterface.furnitures[dataFurniture.id] = entity;
        }
    }
    
    if(data.users != undefined) {
        if(data.users.length == undefined)
            data.users = [ data.users ];

        for(let index in data.users) {
            let entity = new Client.rooms.items.figure(RoomInterface.entity, data.users[index].figure, data.users[index].position.direction);
            
            entity.setPosition(data.users[index].position);
            
            entity.render();
                
            if(data.users[index].actions != undefined) {
                await entity.figure.setActions(data.users[index].actions);

                entity.figure.render();
            }

            entity.data = data.users[index];

            RoomInterface.entity.addEntity(entity);

            RoomInterface.users[data.users[index].id] = entity;

            const friend = Client.user.friends[data.users[index].id];

            if(friend != undefined) {
                if(friend.status == 0 && friend.request == undefined)
                    friend.request = new RoomInterface.display.users.request(RoomInterface.users[data.users[index].id]);
            }
        }
    }
});
