Client.menu.friends = new function() {
    this.$element = $('<div class="menu-friends"></div>').appendTo(Client.menu.$element);

    this.friends = {};

    this.add = function(id) {
        const $element = $('<div class="menu-friend"></div>').appendTo(this.$element);

        Client.game.getUser(id).then(async function(user) {
            const friend = Client.user.friends[id];

            const $content = $('<div class="menu-friend-content"></div>').appendTo($element);

            const $name = $('<p class="menu-friend-name">' + user.name + '</p>').appendTo($content);

            const $buttons = $('<div class="menu-friend-buttons"></div>').appendTo($content);

            if(friend.status == 0) {
                $element.addClass("menu-friend-request");
            }
            else {
                $element.click(function(e) {
                    if($(e.target).hasClass("menu-friend-content"))
                        $element.toggleClass("active");
                });

                $('<div class="menu-friend-follow sprite-user-follow"></div>').appendTo($buttons);
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

            await entity.process();
            await entity.render();
        });

        return $element;
    };

    Client.rooms.interface.events.stop.push(function() {
        for(let id in Client.user.friends) {
            if(Client.user.friends[id].request == undefined)
                continue;

            Client.user.friends[id].request.destroy();
            
            delete Client.user.friends[id].request;
        }
    });
};
