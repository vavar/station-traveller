package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/vavar/station-traveller/golang/route"
)

func validStation(validMap map[string]route.Station, input string) string {
	text := strings.ToUpper(input)
	if _, ok := validMap[text]; ok {
		return text
	}
	return ""
}

func main() {
	args := os.Args[1:]
	filePath := args[0]

	routesMap, err := route.ParseRoutes(filePath)
	if err != nil {
		log.Fatal(err)
		return
	}

	scanner := bufio.NewScanner(os.Stdin)
	start := ""
	end := ""

	for start == "" || end == "" {
		if start == "" {
			fmt.Print("what station are you getting on the train?:")
			scanner.Scan()
			start = validStation(routesMap, scanner.Text())
		} else {
			fmt.Print("what station are you getting off the train?:")
			scanner.Scan()
			end = validStation(routesMap, scanner.Text())
		}
	}

	fmt.Println(route.CalculateRoute(routesMap, start, end))
}
