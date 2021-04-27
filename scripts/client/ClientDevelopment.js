Client.development = new function() {
    this.$element = $("#client-development");

    this.$info = $(
        '<div class="client-development">' +
            'PROJECT CORTEX DEVELOPMENT' +
            '' +
        '</div>'
    ).css({ "left": 0, "right": "initial" }).appendTo(Client.$element);

    this.$server = $('<p></p>').appendTo(this.$info);

    this.$uptime = $('<span></span>').appendTo(this.$server);

    this.$players = $('<span></span>').appendTo(this.$server).css({
        "margin-left": "6px",
        "float": "right"
    });

    const $stress = $('<br><p>Perform stress test</p>').css({
        "cursor": "pointer"
    }).appendTo(this.$info);

    $stress.on("click", async function() {
        const $content = $("<p>Performing a stress test on the client...<br><br></p>");

        Client.loader.setText($content);
        Client.loader.show();

        const room = Client.rooms.interface.active;

        if(room)
            Client.rooms.interface.stop();

        const start = performance.now();



        let assetStart = 0, assetSpritesStart = 0;

        for(let key in Client.assets.cache) {
            assetStart++;

            if(Client.assets.cache[key].sprites == undefined)
                continue;

            for(let sprite in Client.assets.cache[key].sprites)
                assetSpritesStart++;
        }



        let assetPromisesStart = 0;

        for(let key in Client.assets.promises) {
            if(Client.assets.cache[key].spritesheet != undefined)
                assetPromisesStart++;

            if(Client.assets.cache[key].manifest != undefined)
                assetPromisesStart++;
        }



        const $figures = $('<p></p>').appendTo($content);

        const figureStart = performance.now();

        const figures = [ "hr", "hd", "ch", "lg", "sh" ];

        let slowestFigure = null, fastestFigure = 100000;

        const figureRates = {};

        for(let index = 1; index < 1001; index++) {
            let string = [];

            for(let part in figures)
                string.push(figures[part] + "-" + Math.round(Math.random() * 100) + Math.round(Math.random() * 100));

            string = string.join('.');

            const figureRenderStart = performance.now();

            const figure = new Client.figures.entity(string, {
                direction: Math.round(Math.random() * 6)
            });

            await figure.process();
            await figure.render();

            const figureRenderEnd = performance.now();

            if(figureRates[string] == undefined)
                figureRates[string] = figureRenderEnd - figureRenderStart;

            if(figureRenderEnd - figureRenderStart > slowestFigure)
                slowestFigure = figureRenderEnd - figureRenderStart;

            if(figureRenderEnd - figureRenderStart < fastestFigure)
                fastestFigure = figureRenderEnd - figureRenderStart;

            $figures.html("Figure ticks: " + Math.round(performance.now() - figureStart) + ", renders: " + index + ", ~" + Math.round((performance.now() - figureStart) / index) + "ms/render, fastest ~" + Math.round(fastestFigure) + "ms, slowest ~" + Math.round(slowestFigure) + "ms");
        }

        const figureEnd = performance.now();

        const $furnitures = $('<p></p>').appendTo($content);

        const furnitureStart = performance.now();

        const furnitures = [
            "sound_set_5",
            "clothing_crookedhat",
            "limo_b_mid3",
            "ads_mirror",
            "hween_c16_floor2",
            "usva3_wallrug",
            "scifi_ltd17_mech",
            "santorini_c17_dividerend",
            "usva2_shelf2",
            "pixel_couch_black",
            "coco_sofa_c4",
            "school_stuff_02",
            "ny2015_chocfountain",
            "rainyday_c20_woodenfloor",
            "clothing_nt_moviestarmakeup",
            "highscore_perteam",
            "hc21_12",
            "ads_spang_sleep",
            "gld_gate",
            "summer_c17_merchstall",
            "hween13_thorndiv1",
            "bolly_desk",
            "statue_elk",
            "clothing_h20th",
            "wf_cnd_furnis_hv_avtrs",
            "hween13_castleturret1",
            "pet_waterbottle",
            "pirate_stage3_g",
            "xmas_c16_elf9",
            "ads_mtvtrophy_gold",
            "diamond_painting33",
            "xmas13_snowflake7",
            "bonusbag20_3",
            "val13_lamp",
            "jungle_c16_bkcase2",
            "horse_dye_16",
            "hween12_orb",
            "arabian_bigtb",
            "hblooza14_duckhook",
            "anc_waterfall",
            "neonpunk_c20_lights",
            "rare_colourable_pillar",
            "xmas14_gate2",
            "usva5_lamble",
            "hosptl_cab2",
            "paris_c15_pavement",
            "usva4_table",
            "ads_idol_l_carpet",
            "hotel_c18_cypress",
            "pixel_carpet_green",
            "mystics_rfountain",
            "wildwest_bank",
            "plant_pineapple",
            "clothing_demoneyes",
            "es_icestar",
            "usva4_rug",
            "room_gh15_cab5",
            "garden_chair",
            "newbie_present",
            "hween09_curt",
            "xm09_bauble_27",
            "lt_lava",
            "table_plasto4_bigsq",
            "xmas_c16_woodtile",
            "army15_poster",
            "easter_r16_squid",
            "hween_c19_bewitchedskull",
            "cland_c15_light",
            "attic15_clock",
            "sound_set_53",
            "market_c19_basket",
            "sf_wall",
            "bazaar_c17_dyepurple",
            "tray_cake",
            "garden_staringbush",
            "bb_apparatus",
            "classic8_disco",
            "chair_plasty4",
            "es_score_b",
            "wf_act_mute_triggerer",
            "cmp_fish_s",
            "vikings_wallshield_g",
            "room_wl15_deskfront",
            "tiki_gate",
            "sfx_dubstep3_2",
            "hs_applause",
            "cloud_throne",
            "pcnc_wall1",
            "cpunk_c15_neoarrowup",
            "bb_robo",
            "coralking_c18_angelfish",
            "room_wlof15_chair",
            "suncity_c19_wateroutlet",
            "val15_lilys",
            "classic7_stage",
            "cland15_ltd4",
            "elegant_c17_floor",
            "ads_ob_pillow",
            "val13_easel_4",
            "cland_c15_wall"
        ];

        let slowestFurniture = null, fastestFurniture = 100000;

        const furnitureRates = {};

        for(let index = 1; index < 1001; index++) {
            const furnitureRenderStart = performance.now();

            let id = furnitures[Math.round(Math.random() * (furnitures.length - 1))];

            const furniture = new Client.furnitures.entity({ id, direction: Math.round(Math.random() * 6), animation: Math.round(Math.random()) });

            await furniture.process();
            await furniture.render();

            const furnitureRenderEnd = performance.now();

            if(furnitureRates[id] == undefined)
                furnitureRates[id] = furnitureRenderEnd - furnitureRenderStart;

            if(furnitureRenderEnd - furnitureRenderStart > slowestFurniture)
                slowestFurniture = furnitureRenderEnd - furnitureRenderStart;

            if(furnitureRenderEnd - furnitureRenderStart < fastestFurniture)
                fastestFurniture = furnitureRenderEnd - furnitureRenderStart;

            $furnitures.html("Furniture ticks: " + Math.round(performance.now() - furnitureStart) + ", renders: " + index + ", ~" + Math.round((performance.now() - furnitureStart) / index) + "ms/render, fastest ~" + Math.round(fastestFurniture) + "ms, slowest ~" + Math.round(slowestFurniture) + "ms");
        }

        const furnitureEnd = performance.now();

        const end = performance.now();

        let assetEnd = 0, assetSpritesEnd = 0;

        for(let key in Client.assets.cache) {
            assetEnd++;

            if(Client.assets.cache[key].sprites == undefined)
                continue;

            for(let sprite in Client.assets.cache[key].sprites)
                assetSpritesEnd++;
        }



        let assetPromisesEnd = 0;

        for(let key in Client.assets.promises) {
            if(Client.assets.cache[key].spritesheet != undefined)
                assetPromisesEnd++;

            if(Client.assets.cache[key].manifest != undefined)
                assetPromisesEnd++;
        }

        $("<p><br>" + (assetEnd - assetStart) + " new assets, " + (assetPromisesEnd - assetPromisesStart) + " new downloads, " + (assetSpritesEnd - assetSpritesStart) + " new sprites...</p>").appendTo($content);

        $("<p><br>Finished stress test after " + Math.round(end - start) + "ms!</p>").appendTo($content);

        await Client.socket.messages.sendCall({
            OnStressTest: {
                count: end - start,

                figures: { count: figureEnd - figureStart, rates: figureRates },
                furnitures: { count: furnitureEnd - furnitureStart, rates: furnitureRates },

                assets: { count: assetEnd - assetStart, downloads: assetPromisesEnd - assetPromisesStart, sprites: assetSpritesEnd - assetSpritesStart }
            }
        }, "OnStressTest");

        if(room)
            Client.rooms.interface.start();

        setTimeout(function() {
            Client.loader.hide();
        }, 1000);
    });
    

    this.$stats = $(
        '<div class="client-development">' +
            'PROJECT CORTEX HOBBA ACCESS' +
        '</div>'
    ).appendTo(Client.$element);

    this.$debug = $('<p></p>').appendTo(this.$stats);

    this.$frames = $('<span></span>').appendTo(this.$debug);

    this.$network = $('<span></span>').appendTo(this.$debug).css({
        "margin-left": "6px",
        "float": "right"
    });
};

Client.development.frames = new function() {
    $(window).on("wheel", function(event) {
        if(!event.shiftKey)
            return;
            
        const direction = (event.originalEvent.deltaY < 0)?(1):(-1);
        
        if(!Client.rooms.interface.active)
            return;

        Client.rooms.interface.frameLimit += direction;
    });
};

Client.loader.ready(function() {
    Client.development.furni = new function() {
        const entity = new Dialog({
            title: "Loading",
            
            size: {
                width: 400
            },

            offset: {
                type: "absolute",

                left: "10px",
                top: "50px"
            }
        });

        entity.events.create.push(function() {
        });

        entity.set = async function(furniture) {
            entity.show();
            
            entity.pause();
            
            entity.$content.html("");

            const data = await Client.furnitures.get(furniture.data.furniture);

            const depth = await Client.socket.messages.sendCall({ OnFurnitureDepthRequest: data.id }, "OnFurnitureDepthRequest");
            
            $(
                '<div class="dialog-property">' +
                    '<p>' +
                        '<b>Furniture Depth</b>' +
                        '<span>How high the furniture is in units!</span>' + 
                    '</p>' +
                    
                    '<div class="input-pen">' +
                        '<input class="furniture-depth" type="text" placeholder="Enter a furniture depth..." value="' + depth + '">' +
                    '</div>' + 
                '</div>'
            ).appendTo(entity.$content).find(".furniture-depth").on("change", async function() {
                await Client.socket.messages.sendCall({ Temp_DevFurniUpdate: { id: data.id, depth: parseFloat($(this).val()) } }, "Temp_DevFurniUpdate");
            });

            const logic = await Client.socket.messages.sendCall({ OnFurnitureLogicRequest: data.id }, "OnFurnitureLogicRequest");
            
            $(
                '<div class="dialog-property">' +
                    '<p>' +
                        '<b>Furniture Logic</b>' +
                        '<span>What logic does the use on the server?</span><br>' + 
                        '<i>Changing this can cause unwanted alterations!</i>' + 
                    '</p>' +
                    
                    '<div class="input-pen">' +
                        '<input class="furniture-logic" type="text" placeholder="Enter a furniture logic..." value="' + logic + '">' +
                    '</div>' + 
                '</div>'
            ).appendTo(entity.$content).find(".furniture-logic").on("change", async function() {
                await Client.socket.messages.sendCall({ Temp_DevFurniUpdate: { id: data.id, logic: $(this).val() } }, "Temp_DevFurniUpdate");
            });

            const flags = await Client.socket.messages.sendCall({ OnFurnitureFlagsRequest: data.id }, "OnFurnitureFlagsRequest");
            
            const $flags = $(
                '<div class="dialog-property">' +
                    '<p>' +
                        '<b>Furniture Flags</b>' +
                    '</p>' +
                '</div>'
            ).appendTo(entity.$content);

            const $checkboxes = $('<div></div>').appendTo($flags);

            $(
                '<input type="checkbox" id="stackable" style="width: auto"' + ((flags & Client.furnitures.flags.stackable)?(" checked"):("")) + '>' +
                '<label for="stackable"> Stackable</label>'
            ).appendTo($checkboxes).on("change", async function() {
                await Client.socket.messages.sendCall({ Temp_DevFurniUpdate: { id: data.id, stackable: $(this).val() } }, "Temp_DevFurniUpdate");
            });

            $(
                '<input type="checkbox" id="sitable" style="width: auto"' + ((flags & Client.furnitures.flags.sitable)?(" checked"):("")) + '>' +
                '<label for="sitable"> Sitable</label>'
            ).appendTo($checkboxes).on("change", async function() {
                await Client.socket.messages.sendCall({ Temp_DevFurniUpdate: { id: data.id, sitable: $(this).val() } }, "Temp_DevFurniUpdate");
            });

            $(
                '<input type="checkbox" id="standable" style="width: auto"' + ((flags & Client.furnitures.flags.standable)?(" checked"):("")) + '>' +
                '<label for="standable"> Standable</label>'
            ).appendTo($checkboxes).on("change", async function() {
                await Client.socket.messages.sendCall({ Temp_DevFurniUpdate: { id: data.id, standable: $(this).val() } }, "Temp_DevFurniUpdate");
            });

            $(
                '<input type="checkbox" id="walkable" style="width: auto"' + ((flags & Client.furnitures.flags.walkable)?(" checked"):("")) + '>' +
                '<label for="walkable"> Walkable</label>'
            ).appendTo($checkboxes).on("change", async function() {
                await Client.socket.messages.sendCall({ Temp_DevFurniUpdate: { id: data.id, walkable: $(this).val() } }, "Temp_DevFurniUpdate");
            });

            $(
                '<input type="checkbox" id="sleepable" style="width: auto"' + ((flags & Client.furnitures.flags.sleepable)?(" checked"):("")) + '>' +
                '<label for="sleepable"> Sleep</label>'
            ).appendTo($checkboxes).on("change", async function() {
                await Client.socket.messages.sendCall({ Temp_DevFurniUpdate: { id: data.id, sleepable: $(this).val() } }, "Temp_DevFurniUpdate");
            });

            Client.development.furni.unpause();

            entity.setTitle('HabboFurnitures/' + data.line + '/' + data.id);
        };

        return entity;
    };

    Client.rooms.interface.cursor.events.click.push(function(entity) {
        if(entity == undefined || entity.entity.name != "furniture") {
            Client.development.furni.pause();
            
            return;
        }
        
        Client.development.furni.set(entity.entity);
    });
});

Client.loader.ready(function() {
    Client.development.shop = new function() {
        const entity = new Dialog({
            title: "Loading",
            
            size: {
                width: 400,
                height: 80
            },

            offset: {
                type: "absolute",

                left: "10px",
                top: "250px"
            }
        });

        entity.events.create.push(function() {
        });

        entity.set = async function(page) {
            entity.show();
            
            entity.pause();

            entity.$content.html("");

            $(
                '<div class="dialog-property">' +
                    '<p>' +
                        '<b>Shop Icon</b>' +
                        '<span>What icon identifier the page uses!</span>' + 
                    '</p>' +
                    
                    '<div class="input-pen">' +
                        '<input class="page-icon" type="text" placeholder="Enter a page icon..." value="' + page.icon + '">' +
                    '</div>' + 
                '</div>'
            ).appendTo(entity.$content).find(".page-icon").on("change", async function() {
                const icon = parseInt($(this).val());

                await Client.socket.messages.sendCall({ Temp_DevShopUpdate: { id: page.id, icon: icon } }, "Temp_DevShopUpdate");

                page.icon = icon;

                Client.shop.setPage(page.parent);
                Client.shop.setPage(page.id);
            });

            Client.development.shop.unpause();

            entity.setTitle('HabboShopPages/' + page.title);
        };

        return entity;
    };
});
