Client.menu.friends = new function() {
    this.$element = $('<div class="menu-friends"></div>').appendTo(Client.menu.$element);

    this.friends = {};

    this.add = async function(id) {
        const user = await Client.game.getUser(id);

        const friend = Client.user.friends.find(x => x.friend == id);

        const $element = $('<div class="menu-friend"></div>').appendTo(this.$element);

        if(friend.status == -1)
            return;

        const $content = $('<div class="menu-friend-content"></div>').appendTo($element);

        const $name = $('<p class="menu-friend-name">' + user.name + '</p>').appendTo($content);

        const $buttons = $('<p class="menu-friend-buttons"></p>').appendTo($content);

        if(friend.status == 0) {
            $element.addClass("menu-friend-request");
        }
        else {
            $element.click(function() {
                $element.toggleClass("active");
            });

            $('<i class="sprite-user-chat"></i>').appendTo($buttons);
            $('<i class="sprite-user-follow"></i>').appendTo($buttons);
            $('<div class="user-profile" data-user="' + user.id + '"><i class="sprite-user-profile-big"></i></div>').appendTo($buttons);
        }

        const $figure = $('<div class="menu-friend-figure"></div>').appendTo($content);

        const $canvas = $('<canvas class="menu-friend-figure-canvas" width="256" height="256"></canvas>').appendTo($figure);
        const context = $canvas[0].getContext("2d");

        const entity = new Client.figures.entity(user.figure);

        entity.events.render.push(function(sprites) {
            context.clearRect(0, 0, 256, 256);

            for(let index in sprites)
                context.drawImage(sprites[index].image, sprites[index].left, sprites[index].top);
        });

        this.friends[id] = $element;

        await entity.process();
        await entity.render();
    };
};
    
Client.socket.messages.register("OnUserUpdate", function(data) {
    if(data.friends == undefined)
        return;

    for(let id in Client.menu.friends.friends)
        Client.menu.friends.friends[id].remove();

    for(let index in data.friends)
        Client.menu.friends.add(data.friends[index].friend);
});
    
Client.socket.messages.register("OnUserFriendAdd", function(data) {
    if(Client.menu.friends.friends[data.friend] != undefined) {
        Client.menu.friends.friends[data.friend].remove();
        
        delete Client.menu.friends.friends[data.friend];
    }

    Client.menu.friends.add(data.friend);
});
    
Client.socket.messages.register("OnUserFriendRemove", function(data) {
    if(Client.menu.friends.friends[data] == undefined)
        return;

    Client.menu.friends.friends[data].remove();
    
    delete Client.menu.friends.friends[data];
});
