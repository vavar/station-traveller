const { readFileSync, existsSync } = require('fs');

function createStation(existStation = { nextStations: {} }, destination = '', timeUsage = '') {
    existStation.nextStations[destination] = +timeUsage;
    return existStation;
}

function parseRoutes(fileName) {
    if (!fileName || !existsSync(fileName)) { 
        return {};
    }
    const routesMap = {};
    const data = readFileSync(fileName, 'utf8');
    data.toString().split('\n').forEach(line => {
        const [from, to, timeUsage] = line.split(',');
        if (!from || !to) {
            return;
        }
        routesMap[from] = createStation(routesMap[from], to, timeUsage);
        routesMap[to] = createStation(routesMap[to], from, timeUsage);
    });
    return routesMap;
}

function getTravelPath(routesMap = {}, start = '', stop = '') {

    let routes = {};
    let visitStations = {};
    let from = start;

    routes[from] = { from, timeUsage: 0, stops: 0, route: `${from}`};

    while( from !== stop) {

        visitStations[from] = true;

        const { nextStations:destinations } = routesMap[from];
        const { timeUsage:currentUsage, stops:currentStop, route:currentRoute } = routes[from];

        Object.keys(destinations).forEach(n => {
            const timeUsage = destinations[n] + currentUsage;
            const stops = ( n === stop ) ? currentStop : currentStop + 1;
            const route = `${currentRoute}->${n}`;
            if (routes[n] && routes[n].timeUsage <= timeUsage) {
                return;
            }
            routes[n] = { from, timeUsage, stops, route };
        });

        const next = Object.keys(routes).filter(station => !visitStations[station]);
        if (!next.length) {
            return null;
        }
        from = next.reduce((acc, loc) => routes[acc].timeUsage < routes[loc].timeUsage ? acc : loc);
    }
    return routes;
}

function calculateRoute(routesMap = {}, start = '', end = '') {
    if (!routesMap[start]) {
        return `No routes from ${start} to ${end}`;
    }

    const path = getTravelPath(routesMap, start, end);
    if (!path) {
        return `No routes from ${start} to ${end}`;
    }

    let { stops, timeUsage } = path[end];
    return `Result: ${stops} stop, ${timeUsage} minutes`;
}

module.exports = {
    calculateRoute,
    parseRoutes
}