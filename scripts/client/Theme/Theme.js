Client.theme = new function() {
    this.data = {};

    this.get = function(path, value) {
        const keys = path.split('/');

        let data = this.data;

        for(let index in keys) {
            if(data[keys[index]] == undefined)
                return value;

            data = data[keys[index]];
        }

        return data;
    };
};
