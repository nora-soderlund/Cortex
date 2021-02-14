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
});
