test:
	mocha --compilers js:babel-core/register ./tests/test.js

build:
	babel ./src/react-simplex.js --presets=babel-preset-react,babel-preset-es2015,babel-preset-stage-0 --out-file ./dist/react-simplex.js