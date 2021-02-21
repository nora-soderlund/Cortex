Client.rooms.editor = function(settings) {
    this.tiles = new function() {
        this.$element = $('<div class="room-editor-tiles"></div>');

        const $canvas = $('<canvas></canvas>').appendTo(this.$element);

        let map = settings.map.split('|'), rows = map.length, columns = 0, renderOffset = { left: 0, top: 0 };

        for(let row in map) {
            if(map[row].length > columns)
                columns = map[row].length;

            for(let column in map[row]) {
                if(map[row][column] == 'X')
                    continue;

                map[row][column] = (!Client.utils.isLetter(map[row][column]))?(parseInt(map[row][column])):(Client.utils.fromCharCode(map[row][column]));
            }
        }

        const render = function(canvas) {
            const context = $canvas[0].getContext("2d");

            context.canvas.width = $canvas.parent().width();
            context.canvas.height = $canvas.parent().height();
           
            renderOffset = { left: canvas.offset.left, top: canvas.offset.top };

            context.setTransform(1, .5, -1, .5, renderOffset.left + (rows * 16), renderOffset.top);
            
            for(let row in map) {
                for(let column in map[row]) {
                    if(map[row][column] == 'X')
                        continue;

                    context.fillStyle = "hsl(" + ((360 / 100) * (map[row][column] * 3)) + ", 100%, 50%)";

                    context.fillRect(parseInt(column) * 16, parseInt(row) * 16, 15.5, 15.5);
                }
            }
        };

        $canvas.on("click", function(event) {
            const innerPosition = {
                left: event.offsetX * 0.5 + event.offsetY - (rows * 16) / 2,
                top: event.offsetX * -0.5 + event.offsetY + (rows * 16) / 2
            };

            const coordinate = {
                row: Math.floor(innerPosition.left / 16),
                column: Math.floor(innerPosition.top / 16)
            };
        });

        this.canvas = Client.canvas.addCanvas($canvas[0], { render, draggable: true });
    };
};
