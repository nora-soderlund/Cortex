Client.badges = new function() {
    this.cache = {};

    this.promises = {};

    this.get = async function(id) {
        if(this.cache[id] != undefined)
            return this.cache[id];
            
        if(this.promises[id] != undefined) {
            return new Promise(function(resolve) {
                Client.badges.promises[id].push(function(data) {
                    resolve(data);
                });
            });
        }

        this.promises[id] = [];

        this.cache[id] = await Client.socket.messages.sendCall({ OnBadgeRequest: id }, "OnBadgeRequest", function(result) {
            if(result.id != id)
                return 0;

            return 1;
        });

        for(let index in this.promises[id])
            this.promises[id][index](this.cache[id]);

        return this.cache[id];
    };
};
