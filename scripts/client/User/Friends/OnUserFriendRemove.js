Client.socket.messages.register("OnUserFriendRemove", function(data) {
    const previous = Client.user.friends.findIndex(x => x.friend == parseInt(data));
    
    if(previous == -1)
        return;

    console.log(Client.user.friends[previous]);

    if(Client.user.friends[previous].request != undefined)
        Client.user.friends[previous].request.destroy();

    Client.user.friends.splice(previous, 1);
});
