const Menu = new class {
    constructor() {
        this.element = document.createElement("div");
        this.element.id = "menu";
        this.element.innerHTML = `
            <div class="menu-items"></div>

            <div class="menu-chat"></div>
        `;

        Client.element.append(this.element);

        this.icons = this.element.querySelector(".menu-items");
        this.chat = this.element.querySelector(".menu-chat");

        this.addItem("hotel", function() {
            
        });

        this.addItem("navigator", function() {
            Client.rooms.navigator.toggle();
        });

        this.addItem("shop", function() {
            Client.shop.toggle();
        });
    
        const inventory = this.addItem("inventory", function() {
            Inventory.toggle();
        });
    
        const camera = this.addItem("camera", function() {
            RoomInterface.camera.toggle();
        });
    
        RoomInterface.events.start.push(function() {
            inventory.style.display = "";
            camera.style.display = "";
        });
    
        RoomInterface.events.stop.push(function() {
            camera.style.display = "none";
            inventory.style.display = "none";
        });
    };

    addItem(identifier, callback) {
        const element = document.createElement("div");
        element.className = "menu-item";
        element.innerHTML = `<div class="menu-sprite menu-${identifier}"></div>`;

        element.addEventListener("click", () => callback());
        
        this.icons.append(element);

        return element;
    };
};

Loader.ready(function() {
    const user = Menu.addItem("user", function() {
        WardrobeDialog.toggle();
        
        //MenuSub.element.style.display = ((MenuSub.element.style.display == "none")?("block"):("none"));
    });

    user.innerHTML = "";

    const canvas = document.createElement("div");
    canvas.className = "menu-sprite menu-user";
    user.append(canvas);
    
    const entity = new FigureEntity(Client.user.figure);
    
    SocketMessages.register("OnUserUpdate", function(data) {
        if(data.figure == undefined)
            return;

        entity.setFigure(data.figure);

        entity.render();
    });

    entity.events.render.push(function() {
        canvas.append(entity.canvas);
    });

    entity.process().then(function() {
        entity.render();
    });
});
