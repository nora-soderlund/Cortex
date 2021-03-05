Client.user = new function() {
    this.home = null;

    this.furnitures = {};

    this.figure = "hr-100.hd-180-1.ch-210-66.lg-270-82.sh-290-91";
    
    Client.socket.messages.register("OnUserUpdate", function(data) {
        for(let key in data)
            Client.user[key] = data[key];
    });
    
    Client.socket.messages.register("OnUserFurnitureUpdate", function(data) {
        for(let key in data)
            Client.user.furnitures[key] = data[key];

        if(Client.inventory.active() && Client.inventory.tabs.selected == "furnitures")
            for(let key in data)
                Client.inventory.page.setFurniture(key);
    });
};
