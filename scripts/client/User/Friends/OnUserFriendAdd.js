Client.socket.messages.register("OnUserFriendAdd", function(data) {
    const previous = Client.user.friends.findIndex(x => x.friend = data.friend);
    
    if(previous != -1) {
        if(Client.user.friends[previous].request != undefined)
            Client.user.friends[previous].request.destroy();

        Client.user.friends.splice(previous, 1);
    }

    if(data.status == 0) {
        if(Client.rooms.interface.users[data.friend] == undefined)
            return;

        data.request = Client.rooms.interface.display.users.request(Client.rooms.interface.users[data.friend]);
    }

    Client.user.friends.push(data);
});
