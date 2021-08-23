Client.rooms.items.cursor = function(parent) {
    const entity = new Client.rooms.items.entity(parent, "cursor");

    entity.render = async function() {
        const cursors = await Assets.getManifest("HabboRoomCursor");

        entity.sprites.length = 0;
        
        const sprite = new Client.rooms.items.sprite(entity, await Assets.getSprite("HabboRoomCursor", "HabboRoomCursor_pointer"));
        
        sprite.setOffset(cursors.visualization["HabboRoomCursor_pointer"].offset.left, cursors.visualization["HabboRoomCursor_pointer"].offset.top);

        entity.sprites.push(sprite);
    };

    return entity;
};
