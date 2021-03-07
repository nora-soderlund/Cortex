Client.socket.messages.register("OnRoomEntityRemove", async function(data) {
    if(data.furnitures != undefined) {
        if(data.furnitures.length == undefined)
            data.furnitures = [ data.furnitures ];

        for(let index in data.furnitures) {
            const id = data.furnitures[index];

            if(Client.rooms.interface.display.furniture != undefined && Client.rooms.interface.display.furniture.data.id == id)
                Client.rooms.interface.display.hide();

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

            if(Client.rooms.interface.display.figure != undefined && Client.rooms.interface.display.figure.data.id == id)
                Client.rooms.interface.display.hide();

            const entity = Client.rooms.interface.users[id];

            Client.rooms.interface.entity.removeEntity(entity);

            delete Client.rooms.interface.users[id];
        }
    }
});
