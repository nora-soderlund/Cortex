Client.socket.messages.register("OnRoomEntityUpdate", async function(data) {
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

            if(render)
                await Client.rooms.interface.users[id].figure.render();

            if(data.users[id].position != undefined) {
                if(data.users[id].position.row != undefined && data.users[id].position.column != undefined && data.users[id].position.depth != undefined)
                    Client.rooms.interface.users[id].setPath(Client.rooms.interface.users[id].data.position, data.users[id].position, 500);
            }

            for(let key in data.users[id])
                Client.rooms.interface.users[id].data[key] = data.users[id][key];
        }
    }
});
