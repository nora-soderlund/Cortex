Client.socket.messages.register("OnRoomUserEffect", function(data) {
    if(data.length == undefined)
        data = [ data ];

    for(let index in data) {
        const user = Client.rooms.interface.users[data[index].id];

        if(user == undefined)
            continue;

        user.figure.setEffect(data[index].effect);

        user.figure.render();
    }
});