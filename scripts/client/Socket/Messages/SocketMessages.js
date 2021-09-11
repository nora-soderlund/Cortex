class SocketMessages {
    static events = {};

    static register(event, callback) {
        if(SocketMessages.events[event] == undefined) {
            SocketMessages.events[event] = [];
            
            //Client.utils.log("SocketMessages", "Registered a new event handler for " + event + "!");
        }

        const index = SocketMessages.events[event].push(callback);

        //Client.utils.log("SocketMessages", "Registered event handler " + index + " for " + event + "!");
    };

    static unregister(event, callback) {
        if(SocketMessages.events[event] == undefined)
            return;

        const index = SocketMessages.events[event].indexOf(callback);

        if(index == -1)
            return;

        SocketMessages.events[event].splice(index, 1);

        //Client.utils.log("SocketMessages", "Unregistered event handler " + index + " for " + event + "!");

        if(SocketMessages.events[event].length == 0)
            delete SocketMessages.events[event];
    };

    static send(message) {
        if(Socket.server == undefined)
            return;
            
        Socket.sent++;

        Socket.server.send(JSON.stringify(message));
    };

    static sendCall(message, event, correct = undefined) {
        return new Promise(function(resolve) {
            const task = function(data) {
                if(correct != undefined && correct(data) == 0)
                    return;

                SocketMessages.unregister(event, task);

                resolve(data);
            };

            SocketMessages.register(event, task);

            SocketMessages.send(message);
        });
    };

    static blocks = {};

    static block(event) {
        SocketMessages.blocks[event] = 1;
    };

    static call(event, data) {
        if(SocketMessages.blocks[event] != 1)
            console.log("[%cSocketMessage%c]%c Received " + event + " from the server: %o", "color: orange", "color: inherit", "color: lightblue", data);

        if(SocketMessages.events[event] == undefined)
            console.warn("[%cSocketMessage%c]%c Event " + event + " does not have any client handlers!", "color: orange", "color: inherit", "color: lightblue");

        for(let index in SocketMessages.events[event])
            SocketMessages.events[event][index](data);
    };
};
