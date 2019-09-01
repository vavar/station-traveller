# NodeJS - Find shortest station route

## Usages
```
go run main.go <route-file-path>
```

* route-file-path : relative path for route mapping 

#### Route Mapping Example
```
A,B,5
B,C,5
C,D,7
A,D,15
E,F,5
F,G,5
G,H,10
H,I,10
I,J,5
G,J,20
```
## Development
### Unit Tests
- required `mocha` to be installed with `go dep`

- Run Unit tests with below command
```
npm run test
```