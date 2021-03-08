Client.socket.messages.register("OnRoomEntityRemove", async function(data) {
    if(data.furnitures != undefined) {
        if(data.furnitures.length == undefined)
            data.furnitures = [ data.furnitures ];

        for(let index in data.furnitures) {
            const id = data.furnitures[index];

            const entity = Client.rooms.interface.furnitures[id];

            if(Client.rooms.interface.display.entity == entity)
                Client.rooms.interface.display.hide();

            Client.rooms.interface.entity.removeEntity(entity);

            delete Client.rooms.interface.furnitures[id];
        }
    }

    if(data.users != undefined) {
        if(data.users.length == undefined)
            data.users = [ data.users ];

        for(let index in data.users) {
            const id = data.users[index];

            const entity = Client.rooms.interface.users[id];

            if(Client.rooms.interface.display.entity == entity)
                Client.rooms.interface.display.hide();

            Client.rooms.interface.entity.removeEntity(entity);

            delete Client.rooms.interface.users[id];
        }
    }
});
