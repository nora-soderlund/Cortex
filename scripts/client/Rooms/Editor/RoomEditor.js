Client.rooms.editor = function(settings, change) {
    let editorDepth = 0, editorTool = 0;

    this.tiles = new function() {
        this.element = document.createElement("div");
        this.element.className = "room-editor-tiles";
        this.element.innerHTML = `
            <canvas class="room-editor-tiles"></canvas>
        `;

        const canvasElement = this.element.querySelector(".room-editor-tiles");

        let map = settings.map, rows = map.length, columns = 0, renderOffset = { left: 0, top: 0 };

        for(let row in map) {
            map[row] = map[row].split('');

            if(map[row].length > columns)
                columns = map[row].length;

            for(let column in map[row]) {
                if(map[row][column] == 'X')
                    continue;

                map[row][column] = (!Client.utils.isLetter(map[row][column]))?(parseInt(map[row][column])):(Client.utils.fromCharCode(map[row][column]));
            }
        }

        const render = function(canvas) {
            const context = canvas.getContext("2d");

            context.canvas.width = canvas.parentElement.clientWidth;
            context.canvas.height = canvas.parentElement.clientHeight;
           
            renderOffset = { left: canvas.offset.left, top: canvas.offset.top };

            context.setTransform(1, .5, -1, .5, renderOffset.left, renderOffset.top);

            for(let row in map) {
                for(let column in map[row]) {
                    if(map[row][column] == 'X')
                        continue;

                    context.fillStyle = "hsl(" + (360 - ((360 / 100) * (34 + (map[row][column] * 2.5)))) + ", 100%, 50%)";

                    context.fillRect(parseInt(column) * 16, parseInt(row) * 16, 15.5, 15.5);
                }
            }

            context.strokeStyle = "white";
            context.lineWidth++;

            context.strokeRect(settings.door.column * 16, settings.door.row * 16, 15.5, 15.5);
        };

        this.canvas = new Canvas(canvasElement, { render, draggable: true, offset: { left: canvasElement.width / 2, top: (canvasElement.height / 2) - (rows * 4) } });

        let down = false, lastCoordinate = { row: null, column: null }, timestamp = performance.now();

        canvasElement.addEventListener("mousedown", () => {
            if(this.canvas.draggableEnabled && (performance.now() - this.canvas.draggableTimestamp) > 200)
                return;

            if(!Keys.down["ShiftLeft"])
                return;
                
            down = true;
        });
        
        canvasElement.addEventListener("mouseup", () => {
            down = false;
        });
        
        canvasElement.addEventListener("mousemove", (event) => {
            const innerPosition = {
                left: (event.offsetX - this.canvas.offset.left) * 0.5 + (event.offsetY - this.canvas.offset.top),
                top: (event.offsetX - this.canvas.offset.left) * -0.5 + (event.offsetY - this.canvas.offset.top)
            };

            const coordinate = {
                row: Math.floor(innerPosition.top / 16),
                column: Math.floor(innerPosition.left / 16)
            };

            if(event.type == "mousemove") {
                if(!down)
                    return;

                if(performance.now() - timestamp < 10)
                    return;
                    
                timestamp = performance.now();

                if(lastCoordinate.row == coordinate.row && lastCoordinate.column == coordinate.column)
                    return;

                lastCoordinate = coordinate;
            }
            else if(!Keys.down["ShiftLeft"])
                return;

            let extra = null;
                
            if(editorTool == 0) {
                if(map[coordinate.row] == undefined) {
                    map[coordinate.row] = [];

                    if(coordinate.row < 0) {
                        this.canvas.offset.top -= 8;
                        this.canvas.offset.left += 16;
                    }
                }
                else if(map[coordinate.row][coordinate.column] == undefined) {
                    let hasColumn = false;

                    for(let row in map)
                    for(let column in map[row]) {
                        if(parseInt(column) == coordinate.column) {
                            hasColumn = true;

                            break;
                        }
                    }

                    if(!hasColumn) {
                        if(coordinate.column < 0) {
                            this.canvas.offset.top -= 8;
                            this.canvas.offset.left -= 16;
                        }
                    }
                }

                extra = { rows: 0, columns: 0 };

                if(coordinate.row >= 0) {
                    if(coordinate.column >= 0) {
                        if(map[coordinate.row][coordinate.column] == editorDepth)
                            return;
                    }

                    for(let row = coordinate.row - 1; row != -1; row--)
                        if(map[row] == undefined)
                            map[row] = [];
                }
                else {
                    const margin = coordinate.row * -1;

                    extra.rows = margin;

                    const newMap = [];

                    settings.door.row += margin;

                    for(let row in map)
                        newMap[parseInt(row) + margin] = map[row];
                        
                    coordinate.row = 0;

                    for(let row = 0; row != margin; row++)
                        if(newMap[row] == undefined)
                            newMap[row] = [];

                    map = newMap;
                }

                if(coordinate.column >= 0) {
                    for(let column = coordinate.column - 1; column != -1; column--) {
                        if(map[coordinate.row][column] == undefined)
                            map[coordinate.row][column] = 'X';
                    }
                }
                else {
                    const margin = coordinate.column * -1;

                    extra.columns = margin;

                    settings.door.column += margin;
                    
                    for(let row in map) {
                        const newMap = [];

                        for(let column in map[row])
                            newMap[margin + parseInt(column)] = map[row][column];

                        for(let column = 0; column != margin; column++)
                            if(newMap[column] == undefined)
                                newMap[column] = 'X';

                        map[row] = newMap;
                    }

                    coordinate.column += margin;
                }

                map[coordinate.row][coordinate.column] = editorDepth;
            }
            else if(editorTool == 1) {
                if(map[coordinate.row] == undefined)
                    return;

                if(map[coordinate.row][coordinate.column] == undefined)
                    return;

                if(map[coordinate.row][coordinate.column] == 'X')
                    return;

                map[coordinate.row][coordinate.column] = 'X';
            }
            else if(editorTool == 2) {
                if(map[coordinate.row] == undefined)
                    return;

                if(map[coordinate.row][coordinate.column] == undefined)
                    return;

                if(map[coordinate.row][coordinate.column] == 24)
                    return;

                if(map[coordinate.row][coordinate.column] == 'X')
                    return;
                
                map[coordinate.row][coordinate.column]++;
            }
            else if(editorTool == 3) {
                if(map[coordinate.row] == undefined)
                    return;

                if(map[coordinate.row][coordinate.column] == undefined)
                    return;

                if(map[coordinate.row][coordinate.column] == 0)
                    return;

                if(map[coordinate.row][coordinate.column] == 'X')
                    return;
                
                map[coordinate.row][coordinate.column]--;
            }
            else if(editorTool == 4) {
                if(map[coordinate.row] == undefined)
                    return;

                if(map[coordinate.row][coordinate.column] == undefined)
                    return;

                if(map[coordinate.row][coordinate.column] == 'X')
                    return;

                if(coordinate.row == settings.door.row && coordinate.column == settings.door.column)
                    return;
                
                settings.door.row = coordinate.row;
                settings.door.column = coordinate.column;
            }

            rows = map.length, columns = 0;

            for(let row in map)
            for(let column in map[row]) {
                if(column > columns)
                    columns = column;
            }

            for(let row in map) {
                for(let column = 0; column <= columns; column++) {
                    if(map[row][column] == undefined)
                        map[row][column] = 'X';
                }
            }

            let result = "";

            for(let row in map) {
                if(result.length != 0)
                    result += "|";
                    
                for(let column in map[row]) {
                    if(map[row][column] != 'X' && parseInt(map[row][column]) > 10)
                        result += Client.utils.charCode(parseInt(map[row][column]) - 10);
                    else
                        result += map[row][column];
                }
            }

            change(result, extra);
        });
    };

    this.depth = new function() {
        this.element = document.createElement("div");
        this.element.className = "room-editor-depth";
        this.element.innerHTML = `
            <canvas class="room-editor-depth-canvas"></canvas>

            <div class="room-editor-depth-cursor"></div>
        `;

        const canvas = this.element.querySelector(".room-editor-depth-canvas");

        const cursor = this.element.querySelector(".room-editor-depth-cursor");

        const setCursor = function(depth) {
            const width = canvas.parentElement.width / 24;

            cursor.style.left = `${((width / 2) + (width * depth))}px`;

            editorDepth = depth;
        };

        this.render = function() {
            const context = canvas.getContext("2d");
            
            context.canvas.width = canvas.parentElement.width;
            context.canvas.height = canvas.parentElement.height;

            const steps = 24, width = context.canvas.width / steps;

            for(let index = 0; index < steps; index++) {
                context.fillStyle = "hsl(" + (360 - ((360 / 100) * (34 + (index * 2.5)))) + ", 100%, 50%)";

                const path = new Path2D();

                path.rect(width * index, 0, width + .5, context.canvas.height);

                paths[index] = path;

                context.fill(path);
            }

            setCursor(editorDepth);
        }

        let paths = {}, down = false;

        this.element.addEventListener("mousedown", (event) => {
            down = true;

            const context = canvas.getContext("2d");

            for(let depth in paths) {
                if(!context.isPointInPath(paths[depth], event.offsetX, event.offsetY))
                    continue;

                setCursor(depth);

                break;
            }
        });
        
        this.element.addEventListener("mousemove", (event) => {
            if(!down)
                return;

            const context = canvas.getContext("2d");

            for(let depth in paths) {
                if(!context.isPointInPath(paths[depth], event.offsetX, event.offsetY))
                    continue;

                setCursor(depth);

                break;
            }
        });
        
        this.element.addEventListener("mouseup", () => {
            down = false;
        });
    };

    this.tools = new function() {
        this.add = document.createElement("div");
        this.add.className = "room-editor-tile-add";
        
        this.remove = document.createElement("div");
        this.remove.className = "room-editor-tile-remove";
        
        this.up = document.createElement("div");
        this.up.className = "room-editor-tile-up";
        
        this.down = document.createElement("div");
        this.down.className = "room-editor-tile-down";
        
        this.door = document.createElement("div");
        this.door.className = "room-editor-tile-door";

        this.setTool = function(tool) {
            editorTool = tool;
        };
    };

    this.destroy = function() {
        this.tiles.canvas.destroy();
    };
};
