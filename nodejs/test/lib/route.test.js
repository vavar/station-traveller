const { parseRoutes, calculateRoute } = require('../../lib/route');
const assert = require('assert');

describe('lib/route - parseRoutes', function() {
    it('Should parse valid input', function() {
        const routes = parseRoutes('./test/data/routes.csv');
        assert(Object.keys(routes).length === 3, 'routes should contain 3 stations');
        assert(routes['A'] && Object.keys(routes['A'].nextStations).length === 2, 'station A should exists');
        assert(routes['A'].nextStations['B'] === 10, 'station A to B takes 10 minutes');
        assert(routes['A'].nextStations['C'] === 2, 'station A to B takes 2 minutes');
        assert(routes['B'] && Object.keys(routes['B'].nextStations).length === 1, 'station B should exists');
        assert(routes['C'] && Object.keys(routes['C'].nextStations).length === 1, 'station C should exists');
    });

    it('Should ignored empty line', function() {
        const routes = parseRoutes('./test/data/routes_with_empty_line.csv');
        assert(Object.keys(routes).length === 3, 'routes should contain 3 stations');
        assert(routes['A'] && Object.keys(routes['A'].nextStations).length === 2, 'station A should exists');
        assert(routes['A'].nextStations['B'] === 10, 'station A to B takes 10 minutes');
        assert(routes['A'].nextStations['C'] === 2, 'station A to B takes 2 minutes');
        assert(routes['B'] && Object.keys(routes['B'].nextStations).length === 1, 'station B should exists');
        assert(routes['C'] && Object.keys(routes['C'].nextStations).length === 1, 'station C should exists');
    });

    it('Should ignored invalid line', function() {
        const routes = parseRoutes('./test/data/routes_with_empty_line.csv');
        assert(Object.keys(routes).length === 3, 'routes should contain 3 stations');
        assert(routes['A'] && Object.keys(routes['A'].nextStations).length === 2, 'station A should exists');
        assert(routes['A'].nextStations['B'] === 10, 'station A to B takes 10 minutes');
        assert(routes['A'].nextStations['C'] === 2, 'station A to B takes 2 minutes');
        assert(routes['B'] && Object.keys(routes['B'].nextStations).length === 1, 'station B should exists');
        assert(routes['C'] && Object.keys(routes['C'].nextStations).length === 1, 'station C should exists');
    });
});


describe('lib/route - calculateRoute', function() {
    let routesMap = {
        A: { nextStations: { B: 5, D: 15 }},
        B: { nextStations: { A: 5, C: 5 }},
        C: { nextStations: { B: 5, D: 7 }},
        D: { nextStations: { A: 15, C: 7 }},
        // ---------
        E: { nextStations: { F: 5 }},
        F: { nextStations: { E: 5, G: 5 }},
        G: { nextStations: { F: 5, H: 10, J: 20 }},
        H: { nextStations: { G: 10, I: 10 }},
        I: { nextStations: { H: 10, J: 5 }},
        J: { nextStations: { G: 20 }},
    };
    it('Should get results for valid routes', function(){
        // A -> B
        assert.equal(calculateRoute(routesMap, 'A', 'B'),'Result: 0 stop, 5 minutes');
        // B -> A
        assert.equal(calculateRoute(routesMap, 'B', 'A'),'Result: 0 stop, 5 minutes');
        // A -> B -> C
        assert.equal(calculateRoute(routesMap, 'A', 'C'),'Result: 1 stop, 10 minutes');
        // E -> F -> G -> J = 30 < E -> F -> H -> I -> J = 35
        assert.equal(calculateRoute(routesMap, 'E', 'J'),'Result: 2 stop, 30 minutes');
        // E -> F -> H -> I = 30
        assert.equal(calculateRoute(routesMap, 'E', 'I'),'Result: 3 stop, 30 minutes');
        // I -> J = 5
        assert.equal(calculateRoute(routesMap, 'I', 'J'),'Result: 0 stop, 5 minutes');
    })

    it('Should get error for invalid routes', function(){
        assert.equal(calculateRoute(routesMap, 'A', 'E'),'No routes from A to E');
        assert.equal(calculateRoute(routesMap, 'E', 'C'),'No routes from E to C');
        assert.equal(calculateRoute(routesMap, 'E', 'D'),'No routes from E to D');
        assert.equal(calculateRoute(routesMap, 'J', 'A'),'No routes from J to A');
    })
});