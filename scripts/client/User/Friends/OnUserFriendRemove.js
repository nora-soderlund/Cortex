SocketMessages.register("OnUserFriendRemove", function(data) {
    if(Client.user.friends[data] == undefined)
        return;

    if(Client.user.friends[data].request != undefined)
        Client.user.friends[data].request.destroy();

    if(Client.user.friends[data].menu != undefined)
        Client.user.friends[data].menu.remove();

    delete Client.user.friends[data];
});
