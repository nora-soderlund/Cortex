class DisplayDialog extends Dialog {
    constructor(settings = {}) {
        settings.offset = {
            type: "center"
        };
    
        settings.size = {
            width: 420,
            height: 220
        };

        super(settings);
    };

    create() {
        super.create();

        this.element.classList.add("dialog-display");
    
        this.events.create.push(() => {
            this.header = document.createElement("div");
            this.header.className = "dialog-display-header";
            this.content.appendChild(this.header);
    
            const display = document.createElement("div");
            display.className = "dialog-display-content";
            this.header.appendChild(display);
    
            const container = document.createElement("div");
            container.className = "dialog-display-header-info";
            this.header.appendChild(container);
    
            const info = document.createElement("div");
            info.className = "dialog-display-header-info-content";
            container.appendChild(info);

            display.innerHTML += `<div class="dialog-display-content-star"></div>`;
    
            this.display = document.createElement("div");
            this.display.className = "dialog-display-content-item";
            display.appendChild(this.display);
    
            const button = document.createElement("div");
            button.className = "dialog-button";
            button.innerText = "Okay!";
            this.content.appendChild(button);
    
            button.addEventListener("click", () => {
                this.hide();
            });
        });
    
        this.events.show.push(function() {
            if(this.effects != undefined) {
                this.effects.remove();
    
                delete this.effects;
            }
    
            this.effects = document.createElement("div");
            this.effects.className = "dialog-display-content-effects";
            this.display.appendChild(this.effects);
    
            const sizes = ["small", "small", "medium", "big"];
            
            for(let index = 0; index < 20; index++) {
                setTimeout(function() {
                    const effect = document.createElement("div");
                    effect.className = "dialog-display-content-effect";
                    this.effects.appendChild(effect);
    
                    effect.style.left = `${(3 + (Math.floor((Math.random() * 9)) * 10))}px`;
                    effect.style.top = `${(3 + (Math.floor((Math.random() * 9)) * 10))}px`;
    
                    effect.classList.add("sprite-display-effect-" + sizes[Math.floor(Math.random() * sizes.length)]);
    
                    /*effect.fadeIn(Math.floor(Math.random() * 500), function() {
                        setTimeout(function() {
                            $effect.fadeOut(Math.floor(Math.random() * 500));
                        }, Math.floor(Math.random() * 5000));
                    });*/
                }, Math.floor(Math.random() * 1500));
            }
        });
    }
};
