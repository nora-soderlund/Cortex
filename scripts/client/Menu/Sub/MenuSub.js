const MenuSub = new class {
    constructor() {
        this.element = document.createElement("div");
        this.element.className = "menu-sub";
        Client.element.append(this.element);

        this.addItem("menu-sub-achievements", function() {
            
        });
    };

    addItem = function(sprite, click) {
        const element = document.createElement("div");
        element.className = "menu-sub-item";
        element.innerHTML = `<div class="menu-sub-sprite sprite-${sprite}"></div>`;
        this.element.append(element);

        element.addEventListener("click", click);
    };
};
