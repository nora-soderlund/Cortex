Client.rooms.items.cursor = function(parent) {
    const entity = new Client.rooms.items.entity(parent, "cursor");

    entity.render = async function() {
        const cursors = await Client.assets.get("HabboRoomCursors");

        entity.sprites.length = 0;
        
        const sprite = new Client.rooms.items.sprite(entity, await Client.assets.getSprite("HabboRoomCursors", "default"));
        
        sprite.setOffset(cursors.manifest.visualization["default"].offset.left, cursors.manifest.visualization["default"].offset.top);

        entity.sprites.push(sprite);
    };

    return entity;
};
