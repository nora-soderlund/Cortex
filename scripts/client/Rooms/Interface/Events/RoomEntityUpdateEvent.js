SocketMessages.register("OnRoomEntityUpdate", async function(data) {
    for(let key in data) {
        for(let index in data[key]) {
            const item = data[key][index];

            const entity = RoomInterface[key][index];

            if(item.position != undefined) {
                if(item.position.row != undefined && item.position.column != undefined && item.position.depth != undefined) {
                    entity.stopPath(true);

                    if(item.position.speed != 0) {
                        if(key == "users")
                            entity.data.walk = (item.position.walk == undefined)?(false):(item.position.walk);

                        entity.setPath(entity.data.position, item.position, item.position.speed);
                    }
                    else
                        entity.setCoordinates(item.position.row, item.position.column, item.position.depth);
                }
            }

            for(let property in item)
                RoomInterface[key][index].data[property] = item[property];
        }
    }

    if(data.users != undefined) {
        for(let index in data.users) {
            let render = false;

            if(data.users[index].position != undefined) {
                if(data.users[index].position.direction != undefined) {
                    RoomInterface.users[index].figure.direction = data.users[index].position.direction;

                    render = true;
                }
                
                if(data.users[index].position.actions != undefined) {
                    await RoomInterface.users[index].figure.setActions(data.users[index].position.actions);

                    render = true;
                }
            }
                
            if(data.users[index].action != undefined) {
                await RoomInterface.users[index].figure.setAction(data.users[index].action.action);

                setTimeout(async function() {
                    await RoomInterface.users[index].figure.removeAction(data.users[index].action.action);

                    RoomInterface.users[index].figure.render();
                }, data.users[index].action.time);
            }

            RoomInterface.users[index].figure.render();
        }
    }

    if(data.furnitures != undefined) {
        for(let index in data.furnitures) {
            if(data.furnitures[index].animation != undefined) {
                RoomInterface.furnitures[index].furniture.setAnimation(data.furnitures[index].animation);
            }

            if(data.furnitures[index].position != undefined) {
                if(data.furnitures[index].position.direction != undefined) {
                    RoomInterface.furnitures[index].furniture.setDirection(data.furnitures[index].position.direction);
                }
            }

            RoomInterface.furnitures[index].furniture.render();
        }
    }
});
