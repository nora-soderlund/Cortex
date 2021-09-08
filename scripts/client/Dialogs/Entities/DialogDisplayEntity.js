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

        this.$element.addClass("dialog-display");
    
        this.events.create.push(function() {
            this.$header = $('<div class="dialog-display-header"></div>').appendTo(this.$content);
    
            const $display = $('<div class="dialog-display-content"></div>').appendTo(this.$header);
    
            const $container = $('<div class="dialog-display-header-info"></div>').appendTo(this.$header)
    
            this.$info = $('<div class="dialog-display-header-info-content"></div>').appendTo($container);
    
            $('<div class="dialog-display-content-star"></div>').appendTo($display);
    
            this.$display = $('<div class="dialog-display-content-item"></div>').appendTo($display);
    
            const $button = $('<div class="dialog-button">Okay!</div>').appendTo(this.$content);
    
            $button.on("click", function() {
                this.hide();
            });
        });
    
        this.events.show.push(function() {
            if(this.$effects != undefined) {
                this.$effects.remove();
    
                delete this.$effects;
            }
    
            this.$effects = $('<div class="dialog-display-content-effects"></div>').appendTo(this.$display);
    
            const sizes = ["small", "small", "medium", "big"];
            
            for(let index = 0; index < 20; index++) {
                setTimeout(function() {
                    const $effect = $('<div class="dialog-display-content-effect"></div>').appendTo(this.$effects);
    
                    $effect.css({
                        "left": (3 + (Math.floor((Math.random() * 9)) * 10)) + "px",
                        "top": (3 + (Math.floor((Math.random() * 9)) * 10)) + "px"
                    });
    
                    $effect.addClass("sprite-display-effect-" + sizes[Math.floor(Math.random() * sizes.length)]);
    
                    $effect.fadeIn(Math.floor(Math.random() * 500), function() {
                        setTimeout(function() {
                            $effect.fadeOut(Math.floor(Math.random() * 500));
                        }, Math.floor(Math.random() * 5000));
                    });
                }, Math.floor(Math.random() * 1500));
            }
        });
    }
};
