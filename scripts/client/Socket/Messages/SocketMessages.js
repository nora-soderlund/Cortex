Client.socket.messages = new function() {
    this.events = {};

    this.register = function(event, callback) {
        if(this.events[event] == undefined) {
            this.events[event] = [];
            
            //Client.utils.log("SocketMessages", "Registered a new event handler for " + event + "!");
        }

        const index = this.events[event].push(callback);

        //Client.utils.log("SocketMessages", "Registered event handler " + index + " for " + event + "!");
    };

    this.unregister = function(event, callback) {
        if(this.events[event] == undefined)
            return;

        const index = this.events[event].indexOf(callback);

        if(index == -1)
            return;

        this.events[event].splice(index, 1);

        //Client.utils.log("SocketMessages", "Unregistered event handler " + index + " for " + event + "!");

        if(this.events[event].length == 0)
            delete this.events[event];
    };

    this.send = function(message) {
        Client.socket.server.send(JSON.stringify(message));
    };

    this.sendCall = function(message, event) {
        return new Promise(function(resolve) {
            const task = function(data) {
                Client.socket.messages.unregister(event, task);

                resolve(data);
            };

            Client.socket.messages.register(event, task);

            Client.socket.messages.send(message);
        });
    };

    this.call = function(event, data) {
        //Client.utils.log("SocketMessages", "Received " + event + " from the server:");
        Client.utils.object("SocketMessages", "Received " + event + " from the server:", data);

        if(this.events[event] == undefined)
            Client.utils.warn("SocketMessage", "Event " + event + " does not have any client handlers!");

        for(let index in this.events[event])
            this.events[event][index](data);
    };
};
