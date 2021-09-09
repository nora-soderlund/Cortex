const Menu = new class {
    constructor() {
        this.element = document.createElement("div");
        this.element.id = "menu";
        this.element.innerHTML = `
            <div class="menu-items"></div>
        `;

        Client.element.append(this.element);

        this.icons = this.element.querySelector(".menu-items");

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
            Client.rooms.interface.camera.toggle();
        });
    
        Client.rooms.interface.events.start.push(function() {
            inventory.show();
            camera.show();
        });
    
        Client.rooms.interface.events.stop.push(function() {
            camera.hide();
            inventory.hide();
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
        MenuSub.element.style.display = ((MenuSub.element.style.display == "none")?("block"):("none"));
    });

    const canvas = document.createElement("div");
    canvas.className = "menu-sprite menu-user";

    user.innerHTML = canvas;
    
    const entity = new FigureEntity(Client.user.figure);
    
    SocketMessages.register("OnUserUpdate", function(data) {
        if(data.figure == undefined)
            return;

        entity.setFigure(data.figure);

        entity.render();
    });

    entity.events.render.push(function() {
        canvas.innerHTML = entity.canvas;
    });

    entity.process().then(function() {
        entity.render();
    });
});
