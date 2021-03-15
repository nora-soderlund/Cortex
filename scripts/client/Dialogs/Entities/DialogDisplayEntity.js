Client.dialogs.display = function(settings = {}) {
    settings.offset = {
        type: "center"
    };

    settings.size = {
        width: 420,
        height: 220
    };

    const entity = new Client.dialogs.default(settings);

    entity.$element.addClass("dialog-display");

    entity.events.create.push(function() {
        entity.$header = $('<div class="dialog-display-header"></div>').appendTo(entity.$content);

        const $display = $('<div class="dialog-display-content"></div>').appendTo(entity.$header);

        $('<div class="dialog-display-content-star"></div>').appendTo($display);

        entity.$display = $('<div class="dialog-display-content-item"></div>').appendTo($display);

        const $button = $('<div class="dialog-button">Okay!</div>').appendTo(entity.$content);

        $button.on("click", function() {
            entity.hide();
        });
    });

    entity.events.show.push(function() {
        if(entity.$effects != undefined) {
            entity.$effects.remove();

            delete entity.$effects;
        }

        entity.$effects = $('<div class="dialog-display-content-effects"></div>').appendTo(entity.$display);

        const sizes = ["small", "medium", "big"];
        
        for(let index = 0; index < 20; index++) {
            setTimeout(function() {
                const $effect = $('<div class="dialog-display-content-effect"></div>').appendTo(entity.$effects);

                $effect.css({
                    "left": (16 + Math.floor(Math.random() * 64)) + "px",
                    "top": (16 + Math.floor(Math.random() * 64)) + "px"
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

    return entity;
};
