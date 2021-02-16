Client.loader = new function() {
    this.$element = $("#client-loader");

    this.$text = this.$element.find("#client-loader-text");

    this.$scripts = $('<scripts id="client-scripts"></scripts>').appendTo(this.$element);

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

    $.getJSON("assets/client.json", function(data) {
        Client.loader.data = data;
        
        finished();
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

    /*const interface = new Client.rooms.interface(Client.$element);

    const room = new Client.rooms.entity(Client.$element);

    interface.addEntity(room);

    room.updateCanvas();

    const floormap = new Client.rooms.items.floormap(
        room,

        "XXXXXXXXX|X00000000|X00000000|0000000000|X00000000|X00000000|X00000000|X00000000|X00000000|X00000000|X00000000|X00000000|X00000000|X00000000|X00000000|X00000000|X00000000|X00000000|X00000000|X00000000|X00000000",
        "102", 8
    );

    await floormap.render().then(function() {
        room.addEntity(floormap);
    });

    function onRender() {
        room.render(); 

        window.requestAnimationFrame(onRender);
    };

    window.requestAnimationFrame(onRender);

    await interface.addMouseEvents();

    const chat = new Client.rooms.interface.chat();

    interface.addChat(chat);

    await chat.addMessage("information", "This is an information message!");
    await chat.addMessage("bot_light", "This is a bot_light message!");
    await chat.addMessage("bot_dark", "This is a bot_dark message!");
    await chat.addMessage("leather", "This is a leather message!");

    let sofa = new Client.rooms.items.furniture(room, "HabboFurnitures/Club/Sofa", 2);
    sofa.setCoordinates(8, 1, 0);
    sofa.render();

    room.addEntity(sofa);

    sofa = new Client.rooms.items.furniture(room, "HabboFurnitures/Club/Throne", 4);
    sofa.setPath({ row: 7, column: 4, depth: 0 }, { row: 7, column: 2, depth: 0 }, 2 * 12);
    sofa.render();

    room.addEntity(sofa);

    sofa = new Client.rooms.items.furniture(room, "HabboFurnitures/Club/Sofa", 6);
    sofa.setCoordinates(8, 4, 0);
    sofa.render();

    room.addEntity(sofa);

    sofa = new Client.rooms.items.furniture(room, "HabboFurnitures/Club/Sofa", 2);
    sofa.setPath({ row: 1, column: 1, depth: 0 }, { row: 1, column: 5, depth: 0 }, 4 * 12);
    sofa.render();

    room.addEntity(sofa);*/

    // figure tests
    
    const figure2 = new Client.figures.entity("hr-678-34.fa-3276-95.lg-3136-71.he-1606-71.hd-209-1.sh-3275-110.ch-3342-71-92");

    await figure2.render();

   const figure = new Client.figures.entity("hr-100.hd-180-1.ch-210-66.lg-270-82.sh-290-91");

   await figure.render();

    const $canvas = $('<canvas width="256" height="256"></canvas>').prependTo(Client.development.$element);

    const renderer = new Client.furnitures.renderer({
        id: "rare_dragonlamp",

        direction: 4,
        animation: 1
    }, $canvas);

    //furniture.render();


    finished();
});

Client.loader.addStep(async function(finished) {
    Client.rooms.navigator.show();
    
    finished();
});

Client.loader.load(function() {
    Client.loader.setText("Brewing coffee...");

    Client.socket.messages.send({ OnUserReady: null });

    Client.loader.hide();
});
