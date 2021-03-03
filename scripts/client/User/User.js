Client.user = new function() {
    this.home = null;

    this.furnitures = {};
    
    Client.socket.messages.register("OnUserUpdate", function(data) {
        for(let key in data)
            Client.user[key] = data[key];
    });
    
    Client.socket.messages.register("OnUserFurnitureUpdate", function(data) {
        for(let key in data)
            Client.user.furnitures = data;
    });
};
