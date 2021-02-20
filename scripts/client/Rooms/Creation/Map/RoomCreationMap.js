Client.rooms.creation.map = function(map, door) {
    const $canvas = $('<canvas></canvas>');
    const context = $canvas[0].getContext("2d");

    let rows = map.length, columns = 0, maxDepth = 0;

    for(let row in map) {
        if(map[row].length > columns)
            columns = map[row].length;

        for(let column in map[row]) {
            if(map[row][column] == 'X')
                continue;

            map[row][column] = (!Client.utils.isLetter(map[row][column]))?(parseInt(map[row][column])):(Client.utils.fromCharCode(map[row][column]));

            if(map[row][column] > maxDepth)
                maxDepth = map[row][column];
        }
    }

    context.canvas.width = (rows * 4) + (columns * 4) + 2;
    context.canvas.height = (rows * 2) + (columns * 2) + (maxDepth * 4) + 4 + 2;

    context.imageSmoothingEnabled = false;

    for(let row in map) {
        for(let column in map[row]) {
            if(map[row][column] == 'X')
                continue;
                
            if(door.row == row && door.column == column)
                continue;

            const depth = map[row][column];

            let left = 0, top = 0, hasPrevious = false;

            context.setTransform(1, .5, -1, .5, (rows * 4) + 4, (maxDepth * 4) + 4 + 1);
            
            context.fillStyle = "#A57B51";

            left = column * 4 - (depth * 4);
            top = row * 4 - (depth * 4);

            context.fillRect(left, top, 4.5, 4.5);
            
            hasPrevious = false;

            for(let previousColumn = column - 1; previousColumn != -1; previousColumn--) {
                if(map[row][previousColumn] == undefined || map[row][previousColumn] == 'X') {

                    for(let previousRow = row - 1; previousRow != -1; previousRow--) {
                        if(map[previousRow] == undefined || map[previousRow][previousColumn] == 'X')
                            continue;
                            
                        if(door.row == previousRow && door.column == previousColumn)
                           continue;

                        hasPrevious = true;

                        break;
                    }

                    if(hasPrevious)
                        break;

                    continue;
                }
                
                if(door.row == row && door.column == previousColumn)
                    continue;

                hasPrevious = true;

                break;
            }

            if(!hasPrevious) {
                context.setTransform(1, -.5, 0, 1, (rows * 4) + 4, (maxDepth * 4) + 4 + 1);
                
                context.fillStyle = "#D48612";

                left = -(row * 4) + ((column - 1) * 4);
                top = ((column - 1) * 4) - (depth * 4);

                context.fillRect(left, top - 4, 4.5, (door.row == row && door.column == parseInt(column) - 1)?(1):(8.5));
            }

            hasPrevious = false;

            for(let previousRow = row - 1; previousRow != -1; previousRow--) {
                if(map[previousRow] == undefined || map[previousRow][column] == 'X') {

                    for(let previousColumn = column - 1; previousColumn != -1; previousColumn--) {
                        if(map[previousRow][previousColumn] == undefined || map[previousRow][previousColumn] == 'X')
                            continue;

                        if(door.row == previousRow && door.column == previousColumn)
                            continue;

                        hasPrevious = true;

                        break;
                    }

                    if(hasPrevious)
                        break;

                    continue;
                }

                if(door.row == previousRow && door.column == column)
                    continue;

                hasPrevious = true;

                break;
            }

            if(!hasPrevious) {
                context.setTransform(1, .5, 0, 1, (rows * 4) + 4, (maxDepth * 4) + 4 + 1);   
                
                context.fillStyle = "#F0C032";

                left = (column * 4) - (row * 4);
                top = (row * 4) - (depth * 4);

                context.fillRect(left, top - 8, 4.5, (door.row == parseInt(row) - 1 && door.column == column)?(1):(8.5));
            }
        }
    }

    context.resetTransform();

    context.globalCompositeOperation = "destination-over";

    context.filter = "brightness(0%)";
    context.globalAlpha = .5;
    
    context.drawImage(context.canvas, 1, 0);
    context.drawImage(context.canvas, -1, 0);
    context.drawImage(context.canvas, 0, 1);

    return $canvas;
};
