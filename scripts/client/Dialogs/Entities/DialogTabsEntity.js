class DialogTabs {
    active = null;

    constructor(height) {
        this.element = document.createElement("div");
        this.element.className = "dialog-tabs";
        this.element.innerHTML = `
            <div class="dialog-tabs-header"></div>

            <div class="dialog-tabs-container">
                <div class="dialog-tabs-content"></div>
            </div>
        `;
        this.element.style.height = `${height}px`;
    
        this.header = this.element.querySelector(".dialog-tabs-header");
        this.content = this.element.querySelector(".dialog-tabs-content");
    
        this.buttons = {};
    };

    add(identifier, text, callback = undefined, disabled = false) {
        const element = document.createElement("div");
        element.classList.add("dialog-tabs-button");
        element.innerText = text;
        this.header.appendChild(element);

        if(disabled) {
            element.style.pointerEvents = "none";
            element.style.opacity = .5;
        }

        this.buttons[identifier] = { element, callback };

        const entity = this;

        element.addEventListener("click", () => {
            entity.show(identifier);
        });
    };

    hide() {
        this.active?.removeAttribute("active");
        this.active = null;
        
        this.content.innerHTML = "";
    };

    async show(identifier = this.selected) {
        if(identifier == undefined)
            return;
            
        this.hide();
            
        this.active = this.buttons[identifier].element;
        this.active.setAttribute("active", "");

        this.content.innerHTML = "";

        for(let index in this.callbacks)
            await this.callbacks[index](identifier, this.content);

        if(this.buttons[identifier].callback != undefined)
            this.buttons[identifier].callback(this.content);

        this.selected = identifier;
    };

    callbacks = [];

    click(callback) {
        this.callbacks.push(callback);
    };
};
