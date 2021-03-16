Client.inventory.pages.badges = async function($element) {
    $element.html(
        '<div class="inventory-badges">' +
            '<div class="inventory-badges-grid">' +
                '<div class="inventory-badges-container">' +
                    '<div class="inventory-badges-unequipped"></div>' +
                '</div>' +

                '<div class="inventory-badges-equipped"></div>' +
            '</div>' +

            '<div class="inventory-badges-info">' +
                '<div class="inventory-badges-info-badge"></div>' +
                '<div class="inventory-badges-info-content"></div>' +
                '<div class="inventory-badges-info-button"></div>' +
            '</div>' +
        '</div>'
    );
    
    const $infoBadge = $element.find(".inventory-badges-info-badge");
    const $infoContent = $element.find(".inventory-badges-info-content");
    const $infoButton = $element.find(".inventory-badges-info-button");

    const $uneqipped = $element.find(".inventory-badges-unequipped");

    const $equipped = $element.find(".inventory-badges-equipped");

    const badges = await Client.socket.messages.sendCall({ OnUserInventoryBadges: null }, "OnUserInventoryBadges");

    for(let index in badges) {
        const $badge = $('<div class="dialog-item inventory-badges-icon"></div>').prependTo((badges[index].equipped)?($equipped):($uneqipped));

        Client.badges.renderer(badges[index].badge).addClass("inventory-badges-icon-image").appendTo($badge);

        async function click() {
            $element.find(".inventory-badges-icon.active").removeClass("active");

            $badge.addClass("active");

            $infoBadge.html(Client.badges.renderer(badges[index].badge));

            const badge = await Client.badges.get(badges[index].badge);

            $infoContent.html(
                '<b>' + badge.title + '</b>' +
                '<p>' + badge.description + '</p>'
            );

            $infoButton.html("");
            
            $('<div class="dialog-button">' + ((badges[index].equipped)?("Unequip"):("Equip")) + '</div>').appendTo($infoButton).on("click", async function() {
                Client.inventory.pause();

                const result =  await Client.socket.messages.sendCall({ OnUserInventoryBadges: { id: badges[index].badge } }, "OnUserInventoryBadges");

                Client.inventory.unpause();

                if(result == true) {
                    badges[index].equipped = !badges[index].equipped;

                    $badge.remove().appendTo((badges[index].equipped)?($equipped):($uneqipped)).on("click", click).click();
                }
            });
        };

        $badge.on("click", click);
    }
};
