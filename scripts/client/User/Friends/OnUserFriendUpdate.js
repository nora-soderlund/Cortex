SocketMessages.register("OnUserFriendUpdate", function(data) {
    if(data.length == undefined)
        data = [ data ];
    
    for(let index in data) {
        const id = data[index].id;

        if(Client.user.friends[id] == undefined)
            Client.user.friends[id] = {};

        if(data[index].status == 0 && Client.user.friends[id].status != data[index].status && Client.user.friends[id].request == undefined && RoomInterface.users[id] != undefined)
            data[index].request = new RoomInterface.display.users.request(RoomInterface.users[id]);

            
        if(Client.user.friends[id].menu != undefined)
            Client.user.friends[id].menu.remove();

        if(data[index].status != -1)
            data[index].menu = MenuFriends.add(id);

        for(let key in data[index])
            Client.user.friends[id][key] = data[index][key];
    }
});
