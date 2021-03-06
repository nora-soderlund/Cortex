Client.utils = new function() {
    this.colors = {
        "Loader": "orange",
        "Assets": "skyblue",
        "Socket": "pink",
        "SocketMessages": "pink"
    };

    this.log = function(header, message, indent = 0, tab = false) {
        const name = header.split(':')[0];

        if(this.colors[name] != undefined) {

            indent = 64 + (indent * 32);
            
            return console.log(((tab)?("\t"):("")) + "[%c" + header + "%c] %c" + message, "color: " + this.colors[name] + "", "color: inherit", "color: " + ((indent != 0)?("rgba(" + (255 - indent) + ", " + (255 - indent) + ", " + (255 - indent) + ", 1)"):("inherit")));
        }

        return console.log(((tab)?("\t"):("")) + "[" + header + "] " + message);
    };

    this.warn = function(header, message, tab = false) {
        return console.warn(((tab)?("\t"):("")) + "[" + header + "] " + message);
    };
    
    this.error = function(header, message, tab = false) {
        return console.error(((tab)?("\t"):("")) + "[" + header + "] " + message);
    };
    
    this.info = function(header, message, tab = false) {
        return console.info(((tab)?("\t"):("")) + "[" + header + "] " + message);
    };
    
    this.object = function(header, message, object, tab = false) {
        const name = header.split(':')[0];

        if(this.colors[name] != undefined) 
            return console.log(((tab)?("\t"):("")) + "[%c" + header + "%c] %c" + message + " %o", "color: " + this.colors[name] + "", "color: inherit", "color: inherit", object);

        return console.log(((tab)?("\t"):("")) + "[" + header + "] %o", object);
    };

    this.isLetter = function(character) {
        return character.toLowerCase() != character.toUpperCase();
    };

    this.charCode = function(number) {
        return String.fromCharCode(97 + number);
    };

    this.fromCharCode = function(number) {
        return number.charCodeAt(0) - 97;
    };

    this.getArrayMedian = function(array) {
        const newArray = JSON.parse(JSON.stringify(array));

        newArray.sort(function(a, b){
            return a - b;
        });

        var i = newArray.length / 2;

        return i % 1 == 0 ? (newArray[i - 1] + newArray[i]) / 2 : newArray[Math.floor(i)];
    };

    this.getStringMarkup = function(string) {
        const parts = [
            {
                type: "Regular",
                message: ""
            }
        ];

        let currentPart = 0;

        for(let character = 0, length = string.length; character < length; character++) {
            let occurances = 0;

            for(let index in string) {
                if(string[index] == '*')
                    occurances++;
            }

            if(string[character] != '*' || occurances == 1) {
                parts[currentPart].message += string[character];

                string = string.substring(character, length);
                
                character = 0;
                length = string.length;

                continue;
            }

            if(string[character] == '*') {
                if(string[character + 1] == '*') {
                    if(character + 2 == length)
                        break;

                    if(parts[currentPart].type == "Bold") {
                        parts.push({ type: "Regular", message: "" });

                        currentPart++;
                    }
                    else if(parts[currentPart].type != "Bold") {
                        parts.push({ type: "Bold", message: "" });

                        currentPart++;
                    }

                    character++;
                }
                else {
                    if(character + 1 == length)
                        break;

                    if(parts[currentPart].type == "Italic") {
                        parts.push({ type: "Regular", message: "" });

                        currentPart++;
                    }
                    else if(parts[currentPart].type != "Italic") {
                        parts.push({ type: "Italic", message: "" });

                        currentPart++;
                    }
                }

                string = string.substring(character, length);
                
                character = 0;
                length = string.length;
            }
        }

        return parts;
    };
};
