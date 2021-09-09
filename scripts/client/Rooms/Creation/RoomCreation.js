const RoomCreation = new class extends Dialog {
    constructor(settings = {}) {
        settings = {
            title: "Room Creation",
            
            size: {
                width: 580,
                height: 310
            },
    
            offset: {
                type: "center"
            }
        };

        super(settings);

        this.events.create.push(function() {
            this.element.style.overflow = "initial";
    
            this.content.classList.add("room-creation");
        });

        this.events.show.push(function() {
            Client.rooms.navigator.hide();
    
            this.settings = {};
            
            this.showProperties();
        });
    
        this.events.destroy.push(function() {
            if(RoomCreation.editor != undefined) {
                RoomCreation.editor.destroy();
    
                RoomCreation.editor = undefined;
            }
        });
    };

    async showProperties() {
        this.settings.properties = {};

        this.content.innerHTML = "";
        
        const grid = document.createElement("div");
        grid.className = "room-creation-grid";
        grid.innerHTML = `
            <div class="room-creation-information"></div>
        `;
        this.content.append(grid);
        
        const buttons = document.createElement("div");
        buttons.className = "room-creation-buttons";
        this.content.append(buttons);

        const information = grid.querySelector(".room-creation-information");

        let name = document.createElement("div");
        name.className = "room-creation-property";
        name.innerHTML = `
            <p>
                <b>Room Name</b>
                <span>Give your room a fun and interesting title, this is what interests others!</span> 
            </p>
            
            <div class="input-pen">
                <input type="text" class="room-creation-name" placeholder="Enter a room name...">
            </div> 
        `;
        name.querySelector(".room-creation-name").addEventListener("change", (event) => {
            this.settings.properties.title = event.target.value;
        });
        information.append(name);

        let description = document.createElement("div");
        description.className = "room-creation-property";
        description.innerHTML = `
            <p>
                <b>Room Description</b>
                <span>Describe what your room is, what can others do in your room, let them know what it is!</span> 
            </p>
            
            <div class="textarea-pen">
                <textarea type="text" class="room-creation-description" placeholder="Enter a room name..."></textarea>
            </div> 
        `;
        description.querySelector(".room-creation-description").addEventListener("change", (event) => {
            this.settings.properties.description = event.target.value;
        });
        information.append(description);

        const category = document.createElement("div");
        category.className = "room-creation-property";
        category.innerHTML = `
            <p>
                <b>Room Category</b>
                <span>What category does your room fall into?</span> 
            </p>
        `;
        information.append(category);

        const list = [];

        const categories = await RoomCategories.get();

        for(let index in categories)
            list.push({ text: categories[index].name, value: categories[index].id });

        const selection = new DialogSelection("Select a room category...", list);

        category.append(selection.element);

        const privacy = document.createElement("div");
        privacy.className = "room-creation-privacy";
        grid.append(privacy);

        const locks = document.createElement("div");
        locks.className = "room-creation-property";
        locks.innerHTML = `
            <p>
                <b>Room Privacy</b>
                <span>Select whether you want a public, private, or passworded room!</span> 
            </p>

            <div class="input-lock">
                <input class="room-creation-password disabled" type="text" placeholder="Enter a room password...">
            </div> 
            
            <div class="room-creation-privacy-selection">
                <div class="room-creation-privacy-option active" value="0"> 
                    <div class="room-creation-privacy-public"></div>
                </div>
                
                <div class="room-creation-privacy-option" value="1"> 
                    <div class="room-creation-privacy-private"></div>
                </div>

                <div class="room-creation-privacy-option" value="2"> 
                    <div class="room-creation-privacy-password"></div>
                </div>
            </div>
        `;
        privacy.append(locks);


        const password = locks.querySelector(".room-creation-password");

        locks.querySelector(".room-creation-privacy-option").addEventListener("click", (event) => {
            locks.querySelector(".room-creation-privacy-option.active").classList.remove("active");

            event.target.classList.add("active");

            if(event.target.value != 2)
                password.classList.add("disabled");
            else
                password.classList.remove("disabled");
        });

        const next = document.createElement("div");
        next.className = "dialog-button";
        next.innerHTML = "Continue »";
        buttons.append(next);

        next.addEventListener("click", () => {
            this.showMap();
        });
    };

    async showMap() {
        this.content.innerHTML = "";

        this.settings.map = {};
        
        const models = await SocketMessages.sendCall({ OnRoomModelsUpdate: null }, "OnRoomModelsUpdate");
        
        const tabs = new DialogTabs(231);

        tabs.add("default", "Default Maps", function(element) {
            if(RoomCreation.editor != undefined) {
                RoomCreation.editor.destroy();

                RoomCreation.editor = undefined;
            }

            element.parentElement.style.overflow = "auto";

            const models = document.createElement("div");
            models.className = "room-creation-models";
            element.append(models);

            for(let index in models) {
                const map = models[index].map.split('|');

                let tiles = 0;

                for(let row in map)
                for(let column in map[row]) {
                    if(map[row][column] != 'X')
                        tiles++;
                }

                const element = document.createElement("div");
                element.className = "dialog-item room-creation-model";
                element.innerHTML = `
                    <p class="room-creation-model-tiles">${tiles} tiles</div>
                `;
                models.append(element);
                
                element.prepend(new RoomCreationMap(map, models[index].door));

                element.addEventListener("click", () => {
                    models.querySelector(".room-creation-model.active").classList.remove("active");

                    element.classList.add("active");

                    this.settings.map = models[index];
                });

                if(this.settings.map.id == undefined || this.settings.map.id == models[index].id)
                    element.click();
            }
        });

        tabs.add("editor", "Map Editor", function(element) {
            element.parentElement.style.overflow = "visible";

            const grid = document.createElement("div");
            grid.className = "room-creation-map";
            element.append(grid);

            const settings = document.createElement("div");
            settings.className = "room-creation-properties";
            settings.style.display = "grid";
            settings.style.paddingbottom = "12px";

            settings.innerHTML = `
                <div class="room-creation-property">
                    <p>
                        <b>Map Editor</b>
                        <span>Use your mouse on the renderer to the left!</span><br><br>
                        <span>Hold shift and left click to use the current selected tool on the editor.</span><br><br>
                        <span>Press right click to copy the depth of an existing tile on the editor.</span> 
                    </p>
                </div>
            `;
            grid.append(settings);


            const toolsProperty = document.createElement("div");
            toolsProperty.className = "room-creation-property";
            toolsProperty.style.margin = "auto 0 0";
            toolsProperty.innerHTML = `
                <p>
                    <b>Map Tools</b>
                    <span>Select what tool you want to use on the editor:</span> 
                </p>

                <div class="room-creation-editor-tools"></div>
            `;
            settings.append(toolsProperty);

            const tools = toolsProperty.querySelector(".room-creation-editor-tools");

            const data = {
                map: this.settings.map.map.split('|'),

                door: {
                    row: this.settings.map.door.row,
                    column: this.settings.map.door.column
                }
            };

            const editor = new Client.rooms.editor(data, function(map) {
                this.settings.map.map = map;

                //const $canvas = new RoomCreationMap(map.split('|'), this.settings.map.door);

                //$settings.html($canvas);
            });

            RoomCreation.editor = editor;

            editor.tiles.element.style.width = "280px";
            editor.tiles.element.style.height = "230px";
    
            grid.prepend(editor.tiles.element);

            editor.depth.element.style.width = "280px";
            editor.depth.element.style.height = "24px";

            editor.tiles.element.append(editor.depth.element);

            editor.depth.render();

            const add = document.createElement("div");
            add.className = "dialog-item";
            add.value = 0;
            add.append(editor.tools.add);
            tools.append(add);

            const remove = document.createElement("div");
            remove.className = "dialog-item";
            remove.value = 1;
            remove.append(editor.tools.remove);
            tools.append(remove);

            const up = document.createElement("div");
            up.className = "dialog-item";
            up.value = 2;
            up.append(editor.tools.up);
            tools.append(up);

            const down = document.createElement("div");
            down.className = "dialog-item";
            down.value = 3;
            down.append(editor.tools.down);
            tools.append(down);

            const door = document.createElement("div");
            door.className = "dialog-item";
            door.value = 4;
            door.append(editor.tools.door);
            tools.append(door);

            const toolItems = tools.getElementsByClassName("dialog-item");
            for(let index = 0; index < toolItems.length; index++) {
                toolItems[index].addEventListener("click", ".dialog-item", () => {
                    tools.querySelector(".dialog-item.active").classList.remove("active");

                    toolItems[index].addClass("active");

                    editor.tools.setTool(toolItems[index].value);
                });
            }

            add.click();
        });

        tabs.show("default");

        this.content.append(tabs.element);

        const buttons = document.createElement("div");
        buttons.className = "room-creation-buttons";
        this.content.append(buttons);
            
        const back = document.createElement("div");
        back.className = "dialog-button";
        back.innerHTML = "« Back";
        back.addEventListener("click", () => this.showProperties());
        buttons.append(back);
            
        const next = document.createElement("div");
        next.className = "dialog-button";
        next.innerHTML = "Continue »";
        next.addEventListener("click", () => {
            await SocketMessages.sendCall({ OnRoomModelCreate: this.settings }, "OnRoomModelCreate");

            this.hide();
        });
        buttons.append(next);
    };
};
