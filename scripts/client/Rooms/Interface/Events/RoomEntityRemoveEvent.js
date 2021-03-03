Client.socket.messages.register("OnRoomEntityRemove", async function(data) {
    if(data.furnitures != undefined) {
        if(data.furnitures.length == undefined)
            data.furnitures = [ data.furnitures ];

        for(let index in data.furnitures) {
            const id = data.furnitures[index];

            const entity = Client.rooms.interface.furnitures[id];

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

            Client.rooms.interface.entity.removeEntity(entity);

            delete Client.rooms.interface.users[id];
        }
    }
});
