const { stdin, stdout, exit, argv } = process;
const { parseRoutes, calculateRoute } = require('./lib/route');
stdin.setEncoding('utf-8');
const routeConfig = argv[2];

if (!routeConfig) {
    stdin.write(`USAGE: node index.js <route-file-path>\n`);
    exit();
}

// Load route file
const routeMap = parseRoutes(routeConfig);

function validRouteStation(data) {
    const inputNode = data.trim().toUpperCase();
    return (routeMap[inputNode]) ? inputNode : null;
}

// main 
var startStation = undefined;
var endStation = undefined;

const inputStartMessage = 'what station are you getting on the train?:';
const inputEndMessage = 'what station are you getting off the train?:';

stdout.write(inputStartMessage);
stdin.on('data', function (data) {
    const validNode = validRouteStation(routeMap, data);
    if (!validNode) {
        (!startStation) ? stdout.write(inputStartMessage)
            : stdout.write(inputEndMessage);
        return;
    }

    if (!startStation) {
        startStation = validNode;
        stdout.write(inputEndMessage);
        return;
    } else {
        endStation = validNode;
    }

    if (startStation && endStation) {
        stdout.write(calculateRoute(routeMap, startStation, endStation) + '\n');
        exit();
    }
});