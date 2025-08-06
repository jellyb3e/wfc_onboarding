import { ground_avail, ground_adj, ground_weights, house_avail, house_adj, house_weights } from '../adjacencyRules.js';
import { directions } from '../directions.js';

export default class TinyTown extends Phaser.Scene {
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
        this.contradiction = false;
        this.allCollapsed = false;

        // call wfc & generate final collapsed map
        this.groundData = this.solve(ground_avail,ground_adj,ground_weights);
        this.houseData = this.solve(house_avail,house_adj,house_weights);

        // create tilemap
        this.map = this.make.tilemap({ 
            tileWidth: 16, 
            tileHeight: 16,
            width: this.mapWidth,
            height: this.mapHeight
        });

        // create tileset from packed tileset image
        this.tileset = this.map.addTilesetImage("tiny-town-packed", "tiny_town_tiles");

        // create dynamic tilemap layers
        this.groundLayer = this.map.createBlankLayer("Ground", this.tileset, 0, 0, this.mapWidth, this.mapHeight).setScale(4);
        this.houseLayer = this.map.createBlankLayer("Houses", this.tileset, 0, 0, this.mapWidth, this.mapHeight).setScale(4);
        
        // fill each layer
        this.fillLayer(this.groundLayer,this.groundData);
        this.fillLayer(this.houseLayer,this.houseData);
    }

    update() {

    }

    weightedRandom(entropy, weights) {
        let totalWeight = 0;
        for (let choice of entropy) {
            totalWeight += weights[choice];
        }
        let r = Math.random() * totalWeight;

        let weight = 0;
        for (let choice of entropy) {
            weight += weights[choice];
            if (r < weight) { 
                return choice;
            }
        }
        return entropy[0];
    }

    valid_cell(x,y) {
        let valid_x = x >= 0 && x < this.mapWidth;
        let valid_y = y >= 0 && y < this.mapHeight;
        return valid_x && valid_y;
    }

    init_map(availableTiles) {
        let entropy = [];
        for (let y = 0; y < this.mapHeight; y++) {
            entropy.push([]);
            for (let x = 0; x < this.mapWidth; x++) {
                entropy[y].push(availableTiles.slice()); // copy available tile states
            }
        }
        return entropy;
    }

    propagate(x,y,adjacencyRules,entropy) {
        let stack = [[x,y]];

        while(stack.length > 0) {
            let top = stack.pop();
            let x = top[0];             // overwrite x and y (bad!)
            let y = top[1];

            for (let {dx,dy,dir} of directions) {
                let adjx = x + dx;
                let adjy = y + dy;
                // if adjacent cell is in bounds
                if (this.valid_cell(adjx,adjy)) {
                    let adjEntropy = entropy[adjy][adjx];
                    let length0 = adjEntropy.length;  // original entropy of the adjacent cell
                    // for each possible tile for the adjacent cell
                    for (let i = adjEntropy.length - 1; i >= 0; i--) {
                        let valid = false;
                        // for each possible tile for the current cell
                        for (let tile of entropy[y][x]) {
                            // check if the current cell's possible tile allows for that adjacent tile possibility
                            if (adjacencyRules[tile][dir].includes(adjEntropy[i])) {
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
        return entropy;
    }

    collapse(x,y,entropy,weights) {
        let entropyAtCell = entropy[y][x];
        let collapseTo;
        if (weights) {
            collapseTo = this.weightedRandom(entropyAtCell, weights);
        } else {
            collapseTo = Phaser.Utils.Array.GetRandom(entropyAtCell);
        }
        return [collapseTo];
    }

    observe(entropy,adjacencyRules,weights) {
        let newEntropy = entropy;
        let smallestEntropy = Infinity;
        let x1 = -1;
        let y1 = -1;
        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                let currLen = entropy[y][x].length;
                if (currLen > 1 && currLen < smallestEntropy) {
                    smallestEntropy = currLen;
                    x1 = x;
                    y1 = y;
                }
            }
        }
        // if smallest entropy cell found
        if (x1 > -1) {
            newEntropy[y1][x1] = this.collapse(x1,y1,entropy,weights);
            newEntropy = this.propagate(x1,y1,adjacencyRules,newEntropy);
        } else {
            this.allCollapsed = true;
            console.log("done generating map\n");
        }
        return newEntropy;
    }

    getFinalTileIDs(entropy) {
        let finalMap = [];
        for (let y = 0; y < this.mapHeight; y++) {
            finalMap.push([]);
            for (let x = 0; x < this.mapWidth; x++) {
                finalMap[y].push(entropy[y][x][0]);
            }
        }
        return finalMap;
    }

    solve(available,adjacencyRules,weights) {
        // initialize map & entropy
        let entropy = this.init_map(available);

        // constraint solver loop
        while (!this.contradiction) {
            entropy = this.observe(entropy,adjacencyRules,weights);
            if (this.allCollapsed) {
                // return map layer
                this.allCollapsed = false;
                return this.getFinalTileIDs(entropy);
            }
        }
    }

    fillLayer(layer,tilemap) {
        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                layer.putTileAt(tilemap[y][x], x, y);
            }
        }
    }
}