package route

import (
	"testing"

	"gotest.tools/assert"
)

func TestParseRoutes(t *testing.T) {
	testCases := map[string]struct {
		filePath string
		stations map[string]Station
		err      string
	}{
		"routeMap load failed": {"a.csv", nil, "open a.csv: no such file or directory"},
		"routeMap load success": {"fixtures/routes.csv",
			map[string]Station{
				"A": Station{Name: "A", Destinations: map[string]int{"B": 10, "C": 2}},
				"B": Station{Name: "B", Destinations: map[string]int{"A": 10}},
				"C": Station{Name: "C", Destinations: map[string]int{"A": 2}},
			}, ""},
	}

	for name, it := range testCases {
		t.Run(name, func(t *testing.T) {
			stations, err := ParseRoutes(it.filePath)
			if it.err != "" {
				assert.Error(t, err, it.err)
			}

			if it.stations != nil {
				assert.DeepEqual(t, stations, it.stations)
			}
		})
	}
}

func TestCalculateRoute(t *testing.T) {
	routesMap := map[string]Station{
		"A": Station{Name: "A", Destinations: map[string]int{"B": 5, "D": 15}},
		"B": Station{Name: "B", Destinations: map[string]int{"A": 5, "C": 5}},
		"C": Station{Name: "C", Destinations: map[string]int{"B": 5, "D": 7}},
		"D": Station{Name: "D", Destinations: map[string]int{"A": 15, "C": 7}},
		"E": Station{Name: "E", Destinations: map[string]int{"F": 5}},
		"F": Station{Name: "F", Destinations: map[string]int{"E": 5, "G": 5}},
		"G": Station{Name: "G", Destinations: map[string]int{"F": 5, "H": 10, "J": 20}},
		"H": Station{Name: "H", Destinations: map[string]int{"G": 10, "I": 10}},
		"I": Station{Name: "I", Destinations: map[string]int{"H": 10, "J": 5}},
		"J": Station{Name: "J", Destinations: map[string]int{"G": 20}},
	}
	testCases := map[string]struct {
		startStation string
		endStation   string
		output       string
	}{
		"A -> B":      {"A", "B", "Result: 0 stop, 5 minutes"},
		"B -> A":      {"B", "A", "Result: 0 stop, 5 minutes"},
		"A -> B -> C": {"A", "C", "Result: 1 stop, 10 minutes"},
		"E -> F -> G -> J = 30 < E -> F -> H -> I -> J = 35": {"E", "J", "Result: 2 stop, 30 minutes"},
		"E -> F -> H -> I = 30":                              {"E", "I", "Result: 3 stop, 30 minutes"},
		"I -> J = 5":                                         {"I", "J", "Result: 0 stop, 5 minutes"},
		"A -> E":                                             {"A", "E", "No routes from A to E"},
		"E -> C":                                             {"E", "C", "No routes from E to C"},
		"E -> D":                                             {"E", "D", "No routes from E to D"},
		"J -> A":                                             {"J", "A", "No routes from J to A"},
	}

	for name, it := range testCases {
		t.Run(name, func(t *testing.T) {
			output := CalculateRoute(routesMap, it.startStation, it.endStation)
			assert.Equal(t, output, it.output)
		})
	}
}
