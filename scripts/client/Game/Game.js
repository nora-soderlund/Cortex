class Game {
    static users = {};

    static promises = {
        users: {}
    };

    static async getUser(id) {
        if(Game.users[id] != undefined)
            return Game.users[id];
            
        if(Game.promises.users[id] != undefined) {
            return new Promise(function(resolve) {
                Game.promises.users[id].push(function(data) {
                    resolve(data);
                });
            });
        }

        Game.promises.users[id] = [];

        Game.users[id] = await SocketMessages.sendCall({ OnUserRequest: id }, "OnUserRequest", x => x.id == id);

        for(let index in Game.promises.users[id])
            Game.promises.users[id][index](Game.users[id]);

        return Game.users[id];
    };
};
