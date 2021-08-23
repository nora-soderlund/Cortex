class Badges {
    static cache = {};

    static promises = {};

    static async get(id) {
        if(Badges.cache[id] != undefined)
            return Badges.cache[id];
            
        if(Badges.promises[id] != undefined) {
            return new Promise(function(resolve) {
                Badges.promises[id].push(function(data) {
                    resolve(data);
                });
            });
        }

        Badges.promises[id] = [];

        Badges.cache[id] = await Client.socket.messages.sendCall({ OnBadgeRequest: id }, "OnBadgeRequest", function(result) {
            if(result.id != id)
                return 0;

            return 1;
        });

        for(let index in Badges.promises[id])
            Badges.promises[id][index](Badges.cache[id]);

        return Badges.cache[id];
    };
};
