Client.rooms.interface.furniture.use = new function() {
    this.start = async function(entity, sprite) {
        if(Client.rooms.interface.furniture.logics[entity.furniture.types.logic] != undefined)
            Client.rooms.interface.furniture.logics[entity.furniture.types.logic](entity, sprite);
    };
};
