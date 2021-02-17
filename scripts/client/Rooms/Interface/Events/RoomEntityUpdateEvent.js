Client.socket.messages.register("OnRoomEntityUpdate", async function(data) {
    for(let key in data) {
        for(let id in data[key]) {
            const item = data[key][id];

            const entity = Client.rooms.interface[key][id];

            if(item.position != undefined) {
                if(item.position.row != undefined && item.position.column != undefined && item.position.depth != undefined) {
                    if(item.position.speed != 0)
                        entity.setPath(entity.data.position, item.position, item.position.speed);
                    else
                        entity.setCoordinates(item.position.row, item.position.column, item.position.depth);
                }
            }

            for(let property in item)
                Client.rooms.interface[key][id].data[property] = item[property];
        }
    }

    if(data.users != undefined) {
        for(let id in data.users) {
            let render = false;

            if(data.users[id].position != undefined) {
                if(data.users[id].position.direction != undefined) {
                    Client.rooms.interface.users[id].figure.direction = data.users[id].position.direction;

                    render = true;
                }
            }

            if(data.users[id].action != undefined) {
                if(data.users[id].action[0].length != undefined) {
                    await Client.rooms.interface.users[id].figure.addAction(data.users[id].action);
                    
                    render = true;
                }
                else {
                    await Client.rooms.interface.users[id].figure.setActions(data.users[id].action);
                    
                    render = true;
                }
            }

            Client.rooms.interface.users[id].figure.render();
        }
    }

    if(data.furnitures != undefined) {
        for(let id in data.furnitures) {
            if(data.furnitures[id].animation != undefined) {
                Client.rooms.interface.furnitures[id].furniture.setAnimation(data.furnitures[id].animation);
            }

            if(data.furnitures[id].position != undefined) {
                if(data.furnitures[id].position.direction != undefined) {
                    Client.rooms.interface.furnitures[id].furniture.setDirection(data.furnitures[id].position.direction);
                }
            }

            Client.rooms.interface.furnitures[id].furniture.render();
        }
    }
});
