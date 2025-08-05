class TinyTown extends Phaser.Scene {
    constructor() {
        super("tinyTown");
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("tiny_town_tiles", "kenny-tiny-town-tilemap-packed.png");    // tile sheet   
    }

    create() {
        this.mapWidth = 10;
        this.mapHeight = 10;
        this.entropy = [];
        this.finalMap = [];
        this.contradiction = false;
        this.allCollapsed = false;

        // define tiles and adjacency rules
        this.availableTiles = [0, 1, 2];
        this.adjacencyRules = {
            0: [0, 1, 2],      // tile 0 can be adjacent to 0, 1, or 2
            1: [0, 1, 2],
            2: [0, 1, 2]
        };

        // initialize map & entropy
        this.init_map();

        // call wfc & generate final collapsed map
        this.solve();

        // create tilemap using collapsed tile data
        this.map = this.make.tilemap({ 
            data: this.finalMap, 
            tileWidth: 16, 
            tileHeight: 16
        });

        // create tileset from packed tileset image
        this.tileset = this.map.addTilesetImage("tiny-town-packed", "tiny_town_tiles");

        // create tilemap layer
        this.grassLayer = this.map.createLayer(0, this.tileset, 0, 0).setScale(4);
    }

    update() {

    }

    weightedRandom(choices, weights) {
        let totalWeight = 0;
        for (let c of choices) {
            totalWeight += weights[c];
        }
        let r = Math.random() * totalWeight;

        let weight = 0;
        for (let c of choices) {
            weight += weights[c];
            if (r < sum) { 
                return c;
            }
        }
        return choices[0];
    }

    valid_cell(x,y) {
        let valid_x = x >= 0 && x < this.mapWidth;
        let valid_y = y >= 0 && y < this.mapHeight;
        return valid_x && valid_y;
    }

    init_map() {
        this.entropy = [];
        for (let y = 0; y < this.mapHeight; y++) {
            this.entropy.push([]);
            for (let x = 0; x < this.mapWidth; x++) {
                this.entropy[y].push(this.availableTiles.slice()); // copy available tile states
            }
        }
    }

    propagate(x,y) {
        let stack = [[x,y]];

        while(stack.length > 0) {
            let top = stack.pop();
            let x = top[0];             // overwrite x and y (bad!)
            let y = top[1];

            let adjacentCells = [[x-1,y],[x+1,y],[x,y-1],[x,y+1]];
            for (let cell of adjacentCells) {
                let adjx = cell[0];
                let adjy = cell[1];
                // if adjacent cell is in bounds
                if (this.valid_cell(adjx,adjy)) {
                    let adjEntropy = this.entropy[adjy][adjx];
                    let length0 = adjEntropy.length;  // original entropy of the adjacent cell
                    // for each possible tile for the adjacent cell
                    for (let i = adjEntropy.length - 1; i >= 0; i--) {
                        let valid = false;
                        // for each possible tile for the current cell
                        for (let tile of this.entropy[y][x]) {
                            // check if the current cell's possible tile allows for that adjacent tile possibility
                            if (this.adjacencyRules[tile].includes(adjEntropy[i])) {
                                // if a valid possibility, keep it in the tile's entropy list
                                valid = true;
                                break;
                            }
                        }
                        // case where adjacent possibility is not valid (remove)
                        if (!valid) {
                            adjEntropy.splice(i, 1);
                        }
                    }
                    let length1 = adjEntropy.length;  // new entropy of the adjacent cell

                    // entropy of 0 (contradiction)
                    if (length1 == 0) {
                        console.log("error: contradiction found\n");
                        this.contradiction = true;
                        return;
                    } else if (length1 < length0) { // change made to list; need to check this tile
                        // push the adjacent tile to the stack
                        stack.push([adjx,adjy]);
                    } else {    // no changes were made; push nothing
                    }
                }
            }
        }
    }

    collapse(x,y,weights=null) {
        let entropyAtCell = this.entropy[y][x];
        let collapseTo;
        if (weights) {
            collapseTo = this.weightedRandom(entropyAtCell, weights);
        } else {
            collapseTo = Phaser.Utils.Array.GetRandom(entropyAtCell);
        }
        this.entropy[y][x] = [collapseTo];
    }

    observe() {
        let smallestEntropy = Infinity;
        let x1 = -1;
        let y1 = -1;
        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                let currLen = this.entropy[y][x].length;
                if (currLen > 1 && currLen < smallestEntropy) {
                    smallestEntropy = currLen;
                    x1 = x;
                    y1 = y;
                }
            }
        }
        // if smallest entropy cell found
        if (x1 > -1) {
            this.collapse(x1,y1);
            this.propagate(x1,y1);
        } else {
            this.allCollapsed = true;
            console.log("done generating map\n");
        }
    }

    getFinalTileIDs() {
        this.finalMap = [];
        for (let y = 0; y < this.mapHeight; y++) {
            this.finalMap.push([]);
            for (let x = 0; x < this.mapWidth; x++) {
                this.finalMap[y].push(this.entropy[y][x][0]);
            }
        }
    }

    solve() {
        while (!this.contradiction) {
            this.observe();
            if (this.allCollapsed) {
                this.getFinalTileIDs();
                return;
            }
        }
    }
}