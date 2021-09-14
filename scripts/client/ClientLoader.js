class Loader {
    static element = document.getElementById("client-loader");

    static text = document.getElementById("client-loader-text");

    static assets = [];
    static readySteps = [];

    static show() {
        //Loader.element.classList.remove("animation-fade-out");
        //Loader.element.classList.add("animation-fade-in");

        Loader.element.style.display = "block";
    };

    static setText(text) {
        Loader.text.innerHTML = text;
    };

    static setError(text) {
        Loader.setText("An error has occurred!<br>" + text);
    };

    static hide() {
        //Loader.element.classList.remove("animation-fade-in");
        //Loader.element.classList.add("animation-fade-out");

        Loader.element.style.display = "none";
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

        const element = document.createElement("script");
        
        element.onload = () => {
            data.shift();

            finished();
        };

        element.src = `${Loader.settings.cdn}scripts/client/${data[0]}`;

        document.body.append(element);
    };
};

Loader.addStep(async function(finished) {
    Loader.setText("Loading configuration...");

    Loader.settings = await (await fetch("/scripts/client.json")).json();

    finished();
});

Loader.addStep(function(finished) {
    /*if(Loader.settings.scripts.length == 0)
        return finished();

    console.log("[%cLoader%c]%c Starting the download of the client scripts...", "color: orange", "color: inherit", "color: lightblue");
    
    Loader.setText("Downloading scripts...");
    
    Loader.loadScripts(Loader.settings.scripts, function() {
        console.log("[%cLoader%c]%c Finished loading the client scripts!", "color: orange", "color: inherit", "color: lightblue");

        finished();
    });*/

    console.log("[%cLoader%c]%c Downloading and running the client...", "color: orange", "color: inherit", "color: lightblue");

    const element = document.createElement("script");
    
    element.onload = () => {
        finished();
    };

    element.src = `/scripts/client.js`;

    document.body.append(element);
});

Loader.addStep(function(finished) {
    //if(Loader.settings.fonts.length == 0)
    //    return finished();

    console.log("[%cLoader%c]%c Starting the download of the font faces...", "color: orange", "color: inherit", "color: lightblue");
    
    Loader.setText("Downloading fonts...");

    const canvas = document.createElement("canvas");
    
    canvas.width = 100;
    canvas.height = 100;

    Client.element.appendChild(canvas);

    const context = canvas.getContext("2d");
    
    for(let index in Loader.settings.fonts) {
        context.font = "12px " + Loader.settings.fonts[index] + "";

        context.fillText(".", 20, 20);
    }

    canvas.remove();
    
    finished();
});

Loader.addStep(async function(finished) {
    console.log("[%cLoader%c]%c Starting the download of the pre-loaded assets...", "color: orange", "color: inherit", "color: lightblue");

    Loader.setText("Preparing assets...");

    for(let index in Loader.settings.assets)
        await Assets.getManifest(Loader.settings.assets[index]);

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
    Loader.addStep(async function(finished) {
        Loader.setText("Loading theme configuration...");

        Client.theme.data = await (await fetch(`/hotel/styles/themes/${theme}/${theme}.json`)).json();

        finished();
    });
}

Loader.load(function() {
    Loader.setText("Brewing coffee...");

    SocketMessages.send({ OnUserReady: null });

    Loader.hide();

    for(let index in Loader.readySteps)
        Loader.readySteps[index]();
});
