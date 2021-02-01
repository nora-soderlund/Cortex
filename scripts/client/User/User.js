Client.user = new function() {
    this.home = null;
    
    Client.socket.messages.register("OnSocketAuthenticate", function(data) {
        for(let key in data)
            Client.user[key] = data[key];
    });
};
