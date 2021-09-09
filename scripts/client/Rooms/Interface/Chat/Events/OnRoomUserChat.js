SocketMessages.register("OnRoomUserChat", async function(data) {
    const user = RoomInterface.users[data.id];
                
    const center = RoomInterface.entity.center;
    const position = RoomInterface.entity.offset;
    const offset = user.getOffset();

    RoomInterface.chat.addMessage("bot_a", "**" + user.data.name + ":** " + data.message, center + offset[0] + 64);

    await user.figure.setAction("Talk");

    setTimeout(async function() {
        await user.figure.removeAction("Talk");

        user.figure.render();
    }, data.message.length * 100);
});
