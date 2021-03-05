Client.game = new function() {
    this.users = {};

    this.getUser = async function(id) {
        if(this.users[id] != undefined)
            return this.users[id];

        this.users[id] = await Client.socket.messages.sendCall({ OnUserRequest: id }, "OnUserRequest", x => x.id == id);

        return this.users[id];
    };
};
