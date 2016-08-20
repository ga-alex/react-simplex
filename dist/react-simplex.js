'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*jslint node: true*/
/*jshint esnext : true */

function SimplexStorage() {
    this.listeners = [];
    this.Storage = {};
    this.sync = {};
}

SimplexStorage.prototype.get = function (name) {
    return this.Storage[name];
};

SimplexStorage.prototype.init = function (name) {
    var _this = this,
        _arguments = arguments;

    var default_value = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
    var sync = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

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
            this.Storage[name] = storage_value != undefined && storage_value != null ? storage_value : default_value;
        } catch (e) {
            console.error('Simplex: can`t sync data from localStorage for ' + name);
        }
    }
};

SimplexStorage.prototype.set = function (name) {
    var scope = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

    this.Storage[name] = scope;

    if (this.sync[name]) {
        localStorage.setItem('SIMPLEX_' + name, JSON.stringify(this.Storage[name]));
    }

    this.trigger(name);
};

SimplexStorage.prototype.onChange = function (name, callback) {
    this.listeners.push({ name: name, callback: callback });
};

SimplexStorage.prototype.trigger = function (name) {
    var _this2 = this;

    var result = null;

    this.listeners.forEach(function (event) {
        if (event.name.indexOf(name) == 0) {
            if (event.callback) {
                result = event.callback.call({}, _defineProperty({}, name, _this2.Storage[name]));
            }
        }
    });
    return result;
};

SimplexStorage.prototype.remove = function (name) {
    for (var i in this.listeners) {
        if (this.listeners[i].name == name) {
            delete this.listeners[i];
        }
    }
    this.listeners = this.listeners.filter(function (e) {
        return e;
    });
};

window.Simplex = new SimplexStorage();

var SimplexConnect = function SimplexConnect(Component) {
    var props = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

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
            var _this3 = this;

            props.forEach(function (prop) {
                Simplex.onChange(prop + '.' + Key, function (scope) {
                    _this3.setState(scope);
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
