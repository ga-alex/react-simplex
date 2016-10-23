'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*jslint node: true*/
/*jshint esnext : true */
/*jslint indent: 4 */
var GLOBAL_EVENT_NAME = 'any';

var SimplexStorage = function () {
    function SimplexStorage() {
        _classCallCheck(this, SimplexStorage);

        this.listeners = [];
        this.Storage = {};
        this.sync = {};
    }

    _createClass(SimplexStorage, [{
        key: 'init',
        value: function init(name) {
            var _this = this,
                _arguments = arguments;

            var default_value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
            var sync = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            this.Storage[name] = default_value;
            this.sync[name] = sync;

            if (!this.hasOwnProperty(name)) {
                Object.defineProperty(this, name, {
                    set: function set(scope) {
                        _this.set(name, scope);
                    },
                    get: function get(prop) {
                        return _this.Storage[_arguments[0]];
                    }
                });
            }

            if (sync) {
                try {
                    var storage_value = JSON.parse(localStorage.getItem('SIMPLEX_' + name));
                    this.Storage[name] = storage_value !== undefined && storage_value !== null ? storage_value : default_value;
                } catch (e) {
                    console.error('Simplex: can`t sync data from localStorage for ' + name);
                }
            }
        }
    }, {
        key: 'get',
        value: function get(name) {
            return this.Storage[name];
        }
    }, {
        key: 'update',
        value: function update(name, scope) {
            var new_scope = Object.assign({}, this.Storage[name], scope);
            this.set(name, new_scope);
        }
    }, {
        key: 'set',
        value: function set(name) {
            var scope = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

            this.Storage[name] = scope;

            if (this.sync[name]) {
                localStorage.setItem('SIMPLEX_' + name, JSON.stringify(this.Storage[name]));
            }

            this.trigger(name);
        }
    }, {
        key: 'onChange',
        value: function onChange() {
            var name = '',
                callback = function callback() {};

            switch (arguments.length) {
                case 1:
                    name = GLOBAL_EVENT_NAME;
                    callback = arguments[0];
                    break;
                case 2:
                    name = arguments[0];
                    callback = arguments[1];
                    break;
            }
            this.listeners.push({ name: name, callback: callback });
        }
    }, {
        key: 'trigger',
        value: function trigger() {
            var _this2 = this;

            var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : GLOBAL_EVENT_NAME;

            var result = null;

            this.listeners.forEach(function (event) {
                if (event.callback) {
                    if (event.name.indexOf(GLOBAL_EVENT_NAME) === 0) {
                        result = event.callback.call({}, _this2.Storage);
                    } else {
                        if (event.name.indexOf(name) === 0) {
                            result = event.callback.call({}, _defineProperty({}, name, _this2.Storage[name]));
                        }
                    }
                }
            });

            return result;
        }
    }, {
        key: 'remove',
        value: function remove() {
            var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : GLOBAL_EVENT_NAME;

            for (var i in this.listeners) {
                if (this.listeners[i].name == name) {
                    delete this.listeners[i];
                }
            }
            this.listeners = this.listeners.filter(function (e) {
                return e;
            });
        }
    }]);

    return SimplexStorage;
}();

window.Simplex = new SimplexStorage();

function SimplexMapToProps(Component, MapStorageToPropsFunction) {
    var Key = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : r & 0x3 | 0x8;
        return v.toString(16);
    });

    var Connected = React.createClass({
        displayName: 'Connected',

        /*getInitialState() {
            //return MapStorageToPropsFunction( Simplex.Storage, this.props );
        },*/

        componentDidMount: function componentDidMount() {
            var _this3 = this;

            Simplex.onChange(GLOBAL_EVENT_NAME + '.' + Key, function (scope) {
                _this3.setState(MapStorageToPropsFunction(Simplex.Storage, _this3.props));
            });
        },
        componentWillUnmount: function componentWillUnmount() {
            Simplex.remove(GLOBAL_EVENT_NAME + '.' + Key);
        },
        render: function render() {
            var MappedProps = MapStorageToPropsFunction(Simplex.Storage, this.props);
            return React.createElement(Component, _extends({}, this.props, MappedProps));
        }
    });
    return Connected;
}

function SimplexConnect(Component) {
    var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    if (!Array.isArray(props)) {
        console.error('SimplexConnect props must be an array');
        return;
    }

    var Key = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : r & 0x3 | 0x8;
        return v.toString(16);
    });

    var Connected = React.createClass({
        displayName: 'Connected',
        getInitialState: function getInitialState() {

            var DefaultState = {};
            props.forEach(function (prop) {
                DefaultState[prop] = Simplex[prop];
            });

            return DefaultState;
        },
        componentDidMount: function componentDidMount() {
            var _this4 = this;

            props.forEach(function (prop) {
                Simplex.onChange(prop + '.' + Key, function (scope) {
                    _this4.setState(scope);
                });
            });
        },
        componentWillUnmount: function componentWillUnmount() {
            props.forEach(function (prop) {
                Simplex.remove(prop + '.' + Key);
            });
        },
        render: function render() {
            return React.createElement(Component, _extends({}, this.props, this.state));
        }
    });
    return Connected;
};

exports.Simplex = Simplex;
exports.SimplexConnect = SimplexConnect;
exports.SimplexStorage = SimplexStorage;
exports.SimplexMapToProps = SimplexMapToProps;
