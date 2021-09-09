const MenuFriends = new class {
    friends = {};

    constructor() {
        this.element = document.createElement("div");
        this.element.className = "menu-friends";
        Menu.element.append(this.element);

        RoomInterface.events.stop.push(function() {
            for(let id in Client.user.friends) {
                if(Client.user.friends[id].request == undefined)
                    continue;
    
                Client.user.friends[id].request.destroy();
                
                delete Client.user.friends[id].request;
            }
        });
    };

    add(id) {
        const element = document.createElement("div");
        element.className = "menu-friend";
        this.element.append(element);

        Game.getUser(id).then(async function(user) {
            const friend = Client.user.friends[id];

            const content = document.createElement("div");
            content.className = "menu-friend-content";
            content.innerHTML = `
                <p class="menu-friend-name">${user.name}</p>
                <div class="menu-friend-buttons"></div>
            `;
            element.append(content);

            const buttons = content.querySelector(".menu-friend-buttons");

            if(friend.status == 0) {
                element.classList.add("menu-friend-request");
            }
            else {
                element.addEventListener("click", function(e) {
                    if(e.target.classList.contains("menu-friend-content"))
                        element.classList.toggle("active");
                });

                //$('<div class="menu-friend-follow sprite-user-follow"></div>').appendTo($buttons);
            }

            const figure = document.createElement("div");
            figure.className = "menu-friend-figure";
            figure.innerHTML = `
                <canvas class="menu-friend-figure-canvas" width="256" height="256"></canvas>
            `;
            content.append(figure);

            const canvas = figure.querySelector(".menu-friend-figure-canvas");
            const context = canvas.getContext("2d");

            const entity = new FigureEntity(user.figure);

            entity.events.render.push(function(sprites) {
                context.clearRect(0, 0, 256, 256);

                for(let index in sprites)
                    context.drawImage(sprites[index].image, sprites[index].left, sprites[index].top);
            });

            await entity.process();
            await entity.render();
        });

        return element;
    };
};
