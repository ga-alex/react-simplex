test:
	mocha --compilers js:babel-core/register ./tests/test.js

build:
	babel ./src/react-simplex.js  --out-file ./dist/react-simplex.js