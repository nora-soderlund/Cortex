class Keys {
    static down = {};
};

window.addEventListener("keydown", (event) => {
    Keys.down[event.code] = performance.now();
});

window.addEventListener("keyup", (event) => {
    delete Keys.down[event.code];
});

window.addEventListener("blur", () => {
    for(let key in Keys.down)
        delete Keys.down[key];
});
