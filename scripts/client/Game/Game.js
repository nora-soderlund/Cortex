Client.game = new function() {
    this.users = {};

    this.promises = {
        users: {}
    };

    this.getUser = async function(id) {
        if(this.users[id] != undefined)
            return this.users[id];
            
        if(this.promises.users[id] != undefined) {
            return new Promise(function(resolve) {
                Client.game.promises.users[id].push(function(data) {
                    resolve(data);
                });
            });
        }

        this.promises.users[id] = [];

        this.users[id] = await SocketMessages.sendCall({ OnUserRequest: id }, "OnUserRequest", x => x.id == id);

        for(let index in this.promises.users[id])
            this.promises.users[id][index](this.users[id]);

        return this.users[id];
    };
};
