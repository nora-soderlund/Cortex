class Loader {
    static $element = $("#client-loader");

    static $text = Loader.$element.find("#client-loader-text");

    static $scripts = $('<scripts id="client-scripts"></scripts>').appendTo(Loader.$element);

    static assets = [];
    static readySteps = [];

    static show() {
        Loader.$element.fadeIn();
    };

    static setText(text) {
        Loader.$text.html(text);
    };

    static setError(text) {
        Loader.setText("An error has occurred!<br>" + text);
    };

    static hide() {
        Loader.$element.fadeOut(500);
    };

    static steps = [];

    static addStep(step) {
        Loader.steps.push(step);
    };

    static addAsset(asset) {
        Loader.assets.push(asset);
    };

    static ready(step) {
        Loader.readySteps.push(step);
    };

    static load(finished) {
        if(Loader.steps.length == 0)
            return finished();

        Loader.steps[0](function() {
            Loader.steps.shift();

            Loader.load(finished);
        });
    };

    static loadScripts(data, finished) {
        if(data.length == 0)
            return finished();

        Loader.loadScript(data, function() {
            Loader.loadScripts(data, finished);
        });
    };

    static loadScript(data, finished) {
        while(data[0][0] == '@') {
            let name = data[0].substring(data[0].lastIndexOf('/') + 1);

            console.warn("[%cLoader%c]%c Skipping @" + name + "...", "color: orange", "color: inherit", "color: lightblue");

            data.shift();

            if(data.length == 0)
                break;
        }

        const name = data[0].substring(data[0].lastIndexOf('/') + 1);

        console.log("[%cLoader%c]%c Downloading and running " + name + "...", "color: orange", "color: inherit", "color: lightblue");

        $.getScript(Loader.settings.cdn + "scripts/client/" + data[0], function() {
            data.shift();

            finished();
        });
    };
};

Loader.addStep(function(finished) {
    Loader.setText("Loading configuration...");

    $.getJSON("/client.json", function(data) {
        Loader.settings = data;
        
        $.getJSON(Loader.settings.cdn + "scripts/Client.json", function(data) {
            Loader.data = data;

            //Loader.data.scripts = [ "Client.js" ];
            
            finished();
        });
    });
});

Loader.addStep(function(finished) {
    if(Loader.data.scripts.length == 0)
        return finished();

    console.log("[%cLoader%c]%c Starting the download of the client scripts...", "color: orange", "color: inherit", "color: lightblue");
    
    Loader.setText("Downloading scripts...");
    
    $.holdReady(true);
    
    Loader.loadScripts(Loader.data.scripts, function() {
        $.holdReady(false);
    
        console.log("[%cLoader%c]%c Finished loading the client scripts!", "color: orange", "color: inherit", "color: lightblue");

        finished();
    });
});

Loader.addStep(function(finished) {
    //if(Loader.data.fonts.length == 0)
    //    return finished();

    console.log("[%cLoader%c]%c Starting the download of the font faces...", "color: orange", "color: inherit", "color: lightblue");
    
    Loader.setText("Downloading fonts...");

    const $canvas = $('<canvas width="100" height="100"></canvas>').appendTo(Client.$element);

    const context = $canvas[0].getContext("2d");
    
    for(let index in Loader.data.fonts) {
        context.font = "12px " + Loader.data.fonts[index] + "";

        context.fillText(".", 20, 20);
    }

    $canvas.remove();
    
    finished();
});

Loader.addStep(async function(finished) {
    console.log("[%cLoader%c]%c Starting the download of the pre-loaded assets...", "color: orange", "color: inherit", "color: lightblue");

    Loader.setText("Preparing assets...");

    for(let index in Loader.data.assets)
        await Assets.getManifest(Loader.data.assets[index]);

    console.log("[%cLoader%c]%c Finished loading the pre-loaded assets!", "color: orange", "color: inherit", "color: lightblue");

    finished();
});

Loader.addStep(async function(finished) {
    Loader.setText("Connecting to the server...");
    
    SocketMessages.register("OnSocketAuthenticate", function(data) {
        finished();
    });
    
    SocketMessages.register("OnSocketClose", function(data) {
        Socket.connected = false;
        
        switch(data) {
            case "USER_KEY_INVALID": {
                Loader.setError("Your user key does not exist!");
            
                break;
            }

            case "USER_KEY_UNAUTHORIZED": {
                Loader.setError("Your user key's network address differs!");
            
                break;
            }

            default: {
                Loader.setError(data);
                
                break;
            }
        }

        Loader.show();
    });
    
    Socket.server = await Socket.open();
});

Loader.addStep(async function(finished) {
    Loader.setText("Executing scripts...");

    Client.rooms.asset = await Assets.getManifest("HabboRoomContent");

    finished();
});

Loader.addStep(async function(finished) {
    Client.rooms.navigator.show();
    
    finished();
});

Loader.addStep(async function(finished) {
    for(let index in Loader.assets)
        await Loader.assets[index]();
    
    finished();
});

if(theme != null) {
    Loader.addStep(function(finished) {
        Loader.setText("Loading theme configuration...");

        $.getJSON("/hotel/styles/themes/" + theme + "/" + theme + ".json", function(data) {
            Client.theme.data = data;

            finished();
        });
    });
}

Loader.load(function() {
    Loader.setText("Brewing coffee...");

    SocketMessages.send({ OnUserReady: null });

    Loader.hide();

    for(let index in Loader.readySteps)
        Loader.readySteps[index]();
});
