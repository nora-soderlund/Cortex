RoomInterface.furniture.use = new function() {
    this.start = async function(entity, sprite) {
        if(RoomInterface.furniture.logics[entity.furniture.types.logic] != undefined)
            RoomInterface.furniture.logics[entity.furniture.types.logic](entity, sprite);
        else
            RoomInterface.furniture.logics["furniture_basic"](entity, sprite);
    };
};
