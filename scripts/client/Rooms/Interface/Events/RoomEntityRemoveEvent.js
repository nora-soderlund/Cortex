SocketMessages.register("OnRoomEntityRemove", async function(data) {
    if(data.furnitures != undefined) {
        if(data.furnitures.length == undefined)
            data.furnitures = [ data.furnitures ];

        for(let index in data.furnitures) {
            const id = data.furnitures[index];

            const entity = RoomInterface.furnitures[id];

            if(RoomInterface.display.entity == entity)
                RoomInterface.display.hide();

            RoomInterface.entity.removeEntity(entity);

            delete RoomInterface.furnitures[id];
        }
    }

    if(data.users != undefined) {
        if(data.users.length == undefined)
            data.users = [ data.users ];

        for(let index in data.users) {
            const id = data.users[index];

            const entity = RoomInterface.users[id];

            if(RoomInterface.display.entity == entity)
                RoomInterface.display.hide();

            RoomInterface.entity.removeEntity(entity);

            delete RoomInterface.users[id];
        }
    }
});
