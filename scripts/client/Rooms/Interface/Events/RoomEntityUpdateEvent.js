Client.socket.messages.register("OnRoomEntityUpdate", async function(data) {
    for(let key in data) {
        for(let index in data[key]) {
            const item = data[key][index];

            const entity = Client.rooms.interface[key][index];

            if(item.position != undefined) {
                if(item.position.row != undefined && item.position.column != undefined && item.position.depth != undefined) {
                    entity.stopPath(true);

                    if(item.position.speed != 0)
                        entity.setPath(entity.data.position, item.position, item.position.speed);
                    else
                        entity.setCoordinates(item.position.row, item.position.column, item.position.depth);
                }
            }

            for(let property in item)
                Client.rooms.interface[key][index].data[property] = item[property];
        }
    }

    if(data.users != undefined) {
        for(let index in data.users) {
            let render = false;

            if(data.users[index].position != undefined) {
                if(data.users[index].position.direction != undefined) {
                    Client.rooms.interface.users[index].figure.direction = data.users[index].position.direction;

                    render = true;
                }
                
                if(data.users[index].position.actions != undefined) {
                    await Client.rooms.interface.users[index].figure.setActions(data.users[index].position.actions);

                    render = true;
                }
            }

            Client.rooms.interface.users[index].figure.render();
        }
    }

    if(data.furnitures != undefined) {
        for(let index in data.furnitures) {
            if(data.furnitures[index].animation != undefined) {
                Client.rooms.interface.furnitures[index].furniture.setAnimation(data.furnitures[index].animation);
            }

            if(data.furnitures[index].position != undefined) {
                if(data.furnitures[index].position.direction != undefined) {
                    Client.rooms.interface.furnitures[index].furniture.setDirection(data.furnitures[index].position.direction);
                }
            }

            Client.rooms.interface.furnitures[index].furniture.render();
        }
    }
});
