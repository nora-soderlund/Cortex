class Events {
    events = {};

    call(event, ...args) {
        if(!this.events.hasOwnProperty(event)) {
            Client.trace(this, "Attempting to call non-existant event called %s", event);

            return false;
        }

        for(let index = 0; index < this.events[event].length; index++)
            this.events[event][index](...args);
    
        return true;
    };

    on(event, resolve) {
        if(!this.events.hasOwnProperty(event))
            this.events[event] = [];

        this.events[event].push(resolve);

        return true;
    };
};
