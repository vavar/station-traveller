package route

import (
	"encoding/csv"
	"fmt"
	"os"
	"strconv"
)

// Station ...
type Station struct {
	Name         string
	Destinations map[string]int
}

// Path ...
type Path struct {
	From  string
	Stop  int
	Usage int
	Path  []string
}

// Route ...
type Route struct {
	Stations map[string]Station
	Paths    map[string]Path
}

func createStation(stations map[string]Station, from string, to string, timeUsage string) Station {
	usage, _ := strconv.Atoi(timeUsage)
	if station, ok := stations[from]; ok {
		station.Destinations[to] = usage
		return station
	}
	station := Station{Name: from, Destinations: map[string]int{to: usage}}
	return station
}

// ParseRoutes ...
func ParseRoutes(filePath string) (map[string]Station, error) {
	f, err := os.Open(filePath)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	// Create a new reader.
	csvr := csv.NewReader(f)
	csvr.FieldsPerRecord = -1

	lines, err := csvr.ReadAll()
	if err != nil {
		return nil, err
	}
	stations := map[string]Station{}
	for _, line := range lines {
		stations[line[0]] = createStation(stations, line[0], line[1], line[2])
		stations[line[1]] = createStation(stations, line[1], line[0], line[2])
	}
	return stations, nil
}

// CalculateRoute ...
func CalculateRoute(stations map[string]Station, from string, to string) string {
	routes := Route{Stations: stations}
	if path, err := routes.Travel(from, to); err == nil {
		return fmt.Sprintf("Result: %d stop, %d minutes", path.Stop, path.Usage)
	}
	return fmt.Sprintf("No routes from %s to %s", from, to)
}

// Travel ...
func (r *Route) Travel(from string, to string) (*Path, error) {

	routes := map[string]Path{from: Path{From: from, Usage: 0, Stop: 0, Path: []string{from}}}
	visitStations := map[string]bool{}

	for from != to {
		visitStations[from] = true
		station := r.currentStation(from)
		r.adjustDestinations(station, routes, to)
		next, err := r.nextStation(visitStations, routes)
		if err != nil {
			return nil, err
		}
		from = next
	}
	path := routes[to]
	return &path, nil
}

// CurrentStation ...
func (r *Route) currentStation(station string) Station {
	return r.Stations[station]
}

// NextStation ..
func (r *Route) nextStation(visitted map[string]bool, routes map[string]Path) (string, error) {
	err := fmt.Errorf("not found next possible station")
	nextStation := ""
	minUsage := -1
	for stationName, path := range routes {
		if _, ok := visitted[stationName]; ok {
			continue
		}
		if (minUsage == -1) || (minUsage > path.Usage) {
			nextStation = stationName
			minUsage = path.Usage
			err = nil
		}
	}
	return nextStation, err
}

// AdjustDestinations ...
func (r *Route) adjustDestinations(station Station, routes map[string]Path, destination string) {
	from := station.Name
	currentRoute := routes[from]
	for next, usage := range station.Destinations {
		currentUsage := currentRoute.Usage + usage
		currentStop := currentRoute.Stop
		path := append(currentRoute.Path, next)
		if next != destination {
			currentStop++
		}
		if existRoute, ok := routes[next]; ok && existRoute.Usage <= currentUsage {
			continue
		}
		routes[next] = Path{From: from, Usage: currentUsage, Stop: currentStop, Path: path}
	}
}
