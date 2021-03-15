Client.loader = new function() {
    this.$element = $("#client-loader");

    this.$text = this.$element.find("#client-loader-text");

    this.$scripts = $('<scripts id="client-scripts"></scripts>').appendTo(this.$element);

    this.assets = [];
    this.readySteps = [];

    this.show = function() {
        this.$element.fadeIn();
    };

    this.setText = function(text) {
        this.$text.html(text);
    }

    this.setError = function(text) {
        this.setText("An error has occurred!<br>" + text);
    }

    this.hide = function() {
        this.$element.fadeOut(500);
    };

    this.steps = [];

    this.addStep = function(step) {
        this.steps.push(step);
    };

    this.addAsset = function(asset) {
        this.assets.push(asset);
    };

    this.ready = function(step) {
        this.readySteps.push(step);
    };

    this.load = function(finished) {
        if(this.steps.length == 0)
            return finished();

        this.steps[0](function() {
            Client.loader.steps.shift();

            Client.loader.load(finished);
        });
    };

    this.loadScripts = function(data, finished) {
        if(data.length == 0)
            return finished();

        this.loadScript(data, function() {
            Client.loader.loadScripts(data, finished);
        });
    };

    this.loadScript = function(data, finished) {
        const name = data[0].substring(data[0].lastIndexOf('/') + 1);

        console.log("[%cLoader%c]%c Downloading and running " + name + "...", "color: orange", "color: inherit", "color: lightblue");

        $.getScript("scripts/client/" + data[0], function() {
            data.shift();

            finished();
        });
    };
};

Client.loader.addStep(function(finished) {
    Client.loader.setText("Loading configuration...");

    $.getJSON("scripts/Client.json", function(data) {
        Client.loader.data = data;
        
        $.getJSON("index.json", function(data) {
            Client.loader.settings = data;
            
            finished();
        });
    });
});

Client.loader.addStep(function(finished) {
    if(Client.loader.data.scripts.length == 0)
        return finished();

    console.log("[%cLoader%c]%c Starting the download of the client scripts...", "color: orange", "color: inherit", "color: lightblue");
    
    Client.loader.setText("Downloading scripts...");
    
    $.holdReady(true);
    
    Client.loader.loadScripts(Client.loader.data.scripts, function() {
        $.holdReady(false);
    
        console.log("[%cLoader%c]%c Finished loading the client scripts!", "color: orange", "color: inherit", "color: lightblue");

        finished();
    });
});

Client.loader.addStep(function(finished) {
    //if(Client.loader.data.fonts.length == 0)
    //    return finished();

    console.log("[%cLoader%c]%c Starting the download of the font faces...", "color: orange", "color: inherit", "color: lightblue");
    
    Client.loader.setText("Downloading fonts...");

    const $canvas = $('<canvas width="100" height="100"></canvas>').appendTo(Client.$element);

    const context = $canvas[0].getContext("2d");
    
    for(let index in Client.loader.data.fonts) {
        context.font = "12px " + Client.loader.data.fonts[index] + "";

        context.fillText(".", 20, 20);
    }

    $canvas.remove();
    
    finished();
});

Client.loader.addStep(async function(finished) {
    console.log("[%cLoader%c]%c Starting the download of the pre-loaded assets...", "color: orange", "color: inherit", "color: lightblue");

    Client.loader.setText("Preparing assets...");

    for(let index in Client.loader.data.assets)
        await Client.assets.getManifest(Client.loader.data.assets[index]);

    console.log("[%cLoader%c]%c Finished loading the pre-loaded assets!", "color: orange", "color: inherit", "color: lightblue");

    finished();
});

Client.loader.addStep(async function(finished) {
    Client.loader.setText("Connecting to the server...");
    
    Client.socket.messages.register("OnSocketAuthenticate", function(data) {
        finished();
    });
    
    Client.socket.messages.register("OnSocketClose", function(data) {
        Client.socket.connected = false;
        
        switch(data) {
            case "USER_KEY_INVALID": {
                Client.loader.setError("Your user key does not exist!");
            
                break;
            }

            case "USER_KEY_UNAUTHORIZED": {
                Client.loader.setError("Your user key's network address differs!");
            
                break;
            }

            default: {
                Client.loader.setError(data);
                
                break;
            }
        }

        Client.loader.show();
    });
    
    Client.socket.server = await Client.socket.open();
});

Client.loader.addStep(async function(finished) {
    Client.loader.setText("Executing scripts...");

    Client.rooms.asset = await Client.assets.getManifest("HabboRoomContent");

    finished();
});

Client.loader.addStep(async function(finished) {
    Client.rooms.navigator.show();
    
    finished();
});

Client.loader.addStep(async function(finished) {
    for(let index in Client.loader.assets)
        await Client.loader.assets[index]();
    
    finished();
});

if(theme != null) {
    Client.loader.addStep(function(finished) {
        Client.loader.setText("Loading theme configuration...");

        $.getJSON("styles/themes/" + theme + "/" + theme + ".json", function(data) {
            Client.theme.data = data;

            finished();
        });
    });
}

Client.loader.load(function() {
    Client.loader.setText("Brewing coffee...");

    Client.socket.messages.send({ OnUserReady: null });

    Client.loader.hide();

    for(let index in Client.loader.readySteps)
        Client.loader.readySteps[index]();

    const entity = new Client.dialogs.display({
        title: "Achievement Unlocked"
    });
    
    entity.show();

    Client.badges.renderer("Cortex/BETA").css("margin", "auto").appendTo(entity.$display);
});
