Inventory.pages.badges = async function(element) {
    element.innerHTML = `
        <div class="inventory-badges">
            <div class="inventory-badges-grid">
                <div class="inventory-badges-container">
                    <div class="inventory-badges-unequipped"></div>
                </div>

                <div class="inventory-badges-equipped"></div>
            </div>

            <div class="inventory-badges-info">
                <div class="inventory-badges-info-badge"></div>
                <div class="inventory-badges-info-content"></div>
                <div class="inventory-badges-info-button"></div>
            </div>
        </div>
    `;
    
    const infoBadge = element.querySelector(".inventory-badges-info-badge");
    const infoContent = element.querySelector(".inventory-badges-info-content");
    const infoButton = element.querySelector(".inventory-badges-info-button");

    const uneqipped = element.querySelector(".inventory-badges-unequipped");

    const equipped = element.querySelector(".inventory-badges-equipped");

    const badges = await SocketMessages.sendCall({ OnUserInventoryBadges: null }, "OnUserInventoryBadges");

    for(let index in badges) {
        const badge = document.createElement("div");
        badge.className = "dialog-item inventory-badges-icon";
        ((badges[index].equipped)?(equipped):(uneqipped)).prepend(badge);

        const badgeRenderer = (new BadgeRenderer(badges[index].badge));
        badgeRenderer.classList.add("inventory-badges-icon-image");
        badge.append(badgeRenderer);

        async function click() {
            element.querySelector(".inventory-badges-icon.active").classList.remove("active");

            badge.classList.add("active");

            infoBadge.innerHTML = (new BadgeRenderer(badges[index].badge));

            const badge = await Badges.get(badges[index].badge);

            infoContent.innerHTML = `
                <b>${badge.title}</b>
                <p>${badge.description}</p>
            `;

            infoButton.innerHTML = "";

            const button = document.createElement("div");
            button.className = "dialog-button";
            button.innerText = ((badges[index].equipped)?("Unequip"):("Equip"));
            button.addEventListener("click", async () => {
                Inventory.pause();

                const result =  await SocketMessages.sendCall({ OnUserInventoryBadges: { id: badges[index].badge } }, "OnUserInventoryBadges");

                Inventory.unpause();

                if(result == true) {
                    badges[index].equipped = !badges[index].equipped;

                    badge.remove();

                    ((badges[index].equipped)?(equipped):(uneqipped)).append(badge);
                    
                    badge.addEventListener("click", click);

                    click();
                }
            });

            infoButton.append(button);
        };

        badge.on("click", click);
    }

    let first = equipped.querySelector(".inventory-badges-icon");
    
    if(first == null)
        first = uneqipped.querySelector(".inventory-badges-icon");

    first.click();
};
