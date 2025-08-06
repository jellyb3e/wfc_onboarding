// this file defines the adjacency rules for different tile types

// ground layer
const ground_avail = [0,1,2,12,13,14,24,25,26,36,37,38];
const ground_adj = {    // defines what a specific tile can be next to
    0: {
        up: [0,1,2,36,37,38],    // tile 0 can have 0,1,etc above it
        down: [0,1,2,12,13,14],
        left: [0,1,2,14,26,38],
        right: [0,1,2,12,24,36]
    },
    1: {
        up: [0,1,2,36,37,38],
        down: [0,1,2,12,13,14],
        left: [0,1,2,14,26,38],
        right: [0,1,2,12,24,36]
    },
    2: {
        up: [0,1,2,36,37,38],
        down: [0,1,2,12,13,14],
        left: [0,1,2,14,26,38],
        right: [0,1,2,12,24,36]
    },
    12: {
        up: [0,1,2],
        down: [24],
        left: [0,1,2],
        right: [13]
    },
    13: {
        up: [0,1,2],
        down: [25],
        left: [12,13],
        right: [13,14]
    },
    14: {
        up: [0,1,2],
        down: [26],
        left: [13],
        right: [0,1,2]
    }, 
    24: {
        up: [12,24],
        down: [24,36],
        left: [0,1,2],
        right: [25]
    },
    25: {
        up: [13,25],
        down: [25,37],
        left: [24,25],
        right: [25,26]
    },
    26: {
        up: [14,26],
        down: [26,38],
        left: [25],
        right: [0,1,2]
    },
    36: {
        up: [24],
        down: [0,1,2],
        left: [0,1,2],
        right: [37]
    },
    37: {
        up: [25],
        down: [0,1,2],
        left: [36,37],
        right: [37,38]
    },
    38: {
        up: [26],
        down: [0,1,2],
        left: [37],
        right: [0,1,2]
    }
};
const ground_weights = {
    0: 10,
    1: 10,
    2: 3,
    12: 1,
    13: 3,
    14: 1,
    24: 3,
    25: 6,
    26: 3,
    36: 1,
    37: 3,
    38: 1
};

// house layer
const house_avail = [-1,48,49,50,52,53,54,60,61,62,64,65,66,72,73,75,76,77,79];
const house_adj = {
    "-1": {
        up: [-1,72,73,75,76,77,79],
        down: [-1,48,49,50,52,53,54],
        left: [-1,50,54,62,66,75,79],
        right: [-1,48,52,60,64,72,76]
    },
    48: {
        up: [-1],
        down: [60],
        left: [-1],
        right: [49]
    },
    49: {
        up: [-1],
        down: [61],
        left: [48,49],
        right: [49,50]
    },
    50: {
        up: [-1],
        down: [62],
        left: [49],
        right: [-1]
    },
    52: {
        up: [-1],
        down: [64],
        left: [-1],
        right: [53]
    },
    53: {
        up: [-1],
        down: [65],
        left: [52,53],
        right: [53,54]
    },
    54: {
        up: [-1],
        down: [66],
        left: [53],
        right: [-1]
    },
    60: {
        up: [48],
        down: [72],
        left: [-1],
        right: [61]
    },
    61: {
        up: [49],
        down: [73],
        left: [60,61],
        right: [61,62]
    },
    62: {
        up: [50],
        down: [75],
        left: [61],
        right: [-1]
    },
    64: {
        up: [52],
        down: [76],
        left: [-1],
        right: [65]
    },
    65: {
        up: [53],
        down: [77],
        left: [64,65],
        right: [65,66]
    },
    66: {
        up: [54],
        down: [79],
        left: [65],
        right: [-1]
    },
    72: {
        up: [60],
        down: [-1],
        left: [-1],
        right: [73]
    },
    73: {
        up: [61],
        down: [-1],
        left: [72,73],
        right: [73,75]
    },
    75: {
        up: [62],
        down: [-1],
        left: [73],
        right: [-1]
    },
    76: {
        up: [64],
        down: [-1],
        left: [-1],
        right: [77]
    },
    77: {
        up: [65],
        down: [-1],
        left: [76,77],
        right: [77,79]
    },
    79: {
        up: [66],
        down: [-1],
        left: [77],
        right: [-1]
    }
};
const house_weights = {
    "-1": 50,
    48: 1,
    49: 1,
    50: 1,
    52: 1,
    53: 1,
    54: 1,
    60: 1,
    61: 1,
    62: 1,
    64: 1,
    65: 1,
    66: 1,
    72: 1,
    73: 1,
    75: 1,
    76: 1,
    77: 1,
    79: 1
};


export { ground_avail, ground_adj, ground_weights, house_avail, house_adj, house_weights };