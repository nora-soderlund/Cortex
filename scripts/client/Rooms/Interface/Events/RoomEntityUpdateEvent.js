Client.socket.messages.register("OnRoomEntityUpdate", async function(data) {
    for(let key in data) {
        for(let id in data[key]) {
            const item = data[key][id];

            if(item.position != undefined) {
                if(item.position.row != undefined && item.position.column != undefined && item.position.depth != undefined)
                    Client.rooms.interface.users[id].setPath(Client.rooms.interface.users[id].data.position, item.position, 500);
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
});
