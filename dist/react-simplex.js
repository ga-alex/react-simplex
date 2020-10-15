"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Storage = exports.SimplexMapToProps = exports.SimplexStorage = exports.SimplexConnect = exports.Simplex = void 0;

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* jslint node: true */

/* jshint esnext : true */

/* jslint indent: 2 */
var _ = require('underscore');

var cloneDeep = require('lodash.clonedeep');

var _ref = function () {
  var StoragePolyFill =
  /*#__PURE__*/
  function () {
    function StoragePolyFill() {
      _classCallCheck(this, StoragePolyFill);

      this.storage = {};
    }

    _createClass(StoragePolyFill, [{
      key: "getItem",
      value: function getItem(name, callback) {
        if (callback) {
          callback({}, this.storage[name]);
        } else {
          return this.storage[name];
        }
      }
    }, {
      key: "setItem",
      value: function setItem(name, value, callback) {
        this.storage[name] = value;

        if (callback) {
          callback();
        }
      }
    }]);

    return StoragePolyFill;
  }();

  var GLOBAL_EVENT_NAME = 'any';

  var Key = function Key() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : r & 0x3 | 0x8;
      return v.toString(16);
    });
  };

  var isNode = function isNode() {
    return typeof window === 'undefined';
  };

  var React = isNode() ? global.React : window.React;

  if (typeof React == 'undefined') {
    React = require('react');
  }

  var SimplexStorage =
  /*#__PURE__*/
  function () {
    function SimplexStorage() {
      _classCallCheck(this, SimplexStorage);

      this.listeners = [];
      this.Storage = {};
      this.StorageDefaults = {};
      this.sync = {};
      this.setStorageDriver(new StoragePolyFill());
    }

    _createClass(SimplexStorage, [{
      key: "setStorageDriver",
      value: function setStorageDriver(storageDriver) {
        var _async = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        this.driverAsync = _async;
        this.driver = storageDriver;
      }
    }, {
      key: "reset",
      value: function reset(name) {
        if (name) {
          this.set(name, cloneDeep(this.StorageDefaults[name]));
        } else {
          for (var n in this.StorageDefaults) {
            this.set(n, cloneDeep(this.StorageDefaults[n]));
          }
        }
      }
    }, {
      key: "init",
      value: function init(name) {
        var _this = this,
            _arguments = arguments;

        var default_value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var sync = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        return new Promise(function (resolve, reject) {
          _this.StorageDefaults[name] = cloneDeep(default_value);
          _this.Storage[name] = cloneDeep(default_value);
          _this.sync[name] = sync;

          if (!_this.hasOwnProperty(name)) {
            Object.defineProperty(_this, name, {
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
              var storage_value = cloneDeep(default_value);

              if (_this.driverAsync) {
                _this.driver.getItem('SIMPLEX_' + name, function (err, result) {
                  if (result !== undefined) {
                    storage_value = JSON.parse(result);
                  }

                  _this.Storage[name] = result !== undefined ? storage_value : cloneDeep(default_value);
                  Simplex.trigger();
                  resolve();
                });
              } else {
                var data = _this.driver.getItem('SIMPLEX_' + name);

                if (data) {
                  storage_value = JSON.parse(_this.driver.getItem('SIMPLEX_' + name));
                }

                _this.Storage[name] = data !== undefined ? storage_value : cloneDeep(default_value);
                resolve();
              }
            } catch (e) {
              resolve();
              console.log(e);
              console.error('Simplex: can`t sync data from localStorage for ' + name);
            }
          } else {
            resolve();
          }
        });
      }
    }, {
      key: "get",
      value: function get(name) {
        if (Array.isArray(this.Storage[name])) {
          return this.Storage[name].slice(0);
        } else {
          return cloneDeep(this.Storage[name]);
        }
      }
    }, {
      key: "update",
      value: function update(name, data) {
        if (!Array.isArray(this.Storage[name]) && _typeof(this.Storage[name]) === 'object') {
          this.set(name, _objectSpread({}, this.Storage[name], data));
          return;
        }

        this.set(name, cloneDeep(data));
      }
    }, {
      key: "set",
      value: function set(name) {
        var _this2 = this;

        var scope = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        this.Storage[name] = scope;

        if (this.sync[name]) {
          if (this.driverAsync) {
            this.driver.setItem('SIMPLEX_' + name, JSON.stringify(this.Storage[name]), function () {
              _this2.trigger(name);
            });
          } else {
            this.driver.setItem('SIMPLEX_' + name, JSON.stringify(this.Storage[name]));
            this.trigger(name);
          }
        } else {
          this.trigger(name);
        }
      }
    }, {
      key: "onChange",
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

        this.listeners.push({
          name: name,
          callback: callback
        });
      }
    }, {
      key: "trigger",
      value: function trigger() {
        var _this3 = this;

        var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : GLOBAL_EVENT_NAME;
        var result = null;
        this.listeners.forEach(function (event) {
          if (event.callback) {
            if (event.name.indexOf(GLOBAL_EVENT_NAME) === 0) {
              result = event.callback.call({}, _this3.Storage);
            } else {
              if (event.name.indexOf(name) === 0) {
                result = event.callback.call({}, _defineProperty({}, name, _this3.Storage[name]));
              }
            }
          }
        });
        return result;
      }
    }, {
      key: "remove",
      value: function remove(name) {
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

  var Simplex = new SimplexStorage();

  function SimplexMapToProps(Component, MapStorageToPropsFunction) {
    if (typeof MapStorageToPropsFunction != 'function') {
      MapStorageToPropsFunction = function MapStorageToPropsFunction(storage) {
        return cloneDeep(storage);
      };
    }

    var Connected =
    /*#__PURE__*/
    function (_React$Component) {
      _inherits(Connected, _React$Component);

      function Connected(props) {
        var _this4;

        _classCallCheck(this, Connected);

        _this4 = _possibleConstructorReturn(this, _getPrototypeOf(Connected).call(this, props));
        var p = props || _this4.props; //React update capability

        var newMappedProps = MapStorageToPropsFunction(Simplex.Storage, props);
        _this4.state = cloneDeep(newMappedProps);
        _this4.key = Key();
        Simplex.onChange(GLOBAL_EVENT_NAME + '.' + _this4.key, function (storage) {
          var newMappedProps = MapStorageToPropsFunction(Simplex.Storage, props, _this4.state); // newMappedProps = cloneDeep(newMappedProps);

          if (!_.isEqual(_this4.state, newMappedProps)) {
            _this4.setState(cloneDeep(newMappedProps));
          }
        });
        return _this4;
      }

      _createClass(Connected, [{
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
          Simplex.remove(GLOBAL_EVENT_NAME + '.' + this.key);
        }
      }, {
        key: "render",
        value: function render() {
          return React.createElement(Component, _extends({}, this.props, this.state));
        }
      }]);

      return Connected;
    }(React.Component);

    return Connected;
  }

  function SimplexConnect(Component) {
    var storageNames = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    if (!Array.isArray(storageNames)) {
      console.error('SimplexConnect props must be an array');
      return;
    }

    var Connected =
    /*#__PURE__*/
    function (_React$Component2) {
      _inherits(Connected, _React$Component2);

      function Connected(props) {
        var _this5;

        _classCallCheck(this, Connected);

        _this5 = _possibleConstructorReturn(this, _getPrototypeOf(Connected).call(this));
        _this5.state = _.pick(Simplex, storageNames);
        _this5.key = Key();
        storageNames.forEach(function (storageName) {
          Simplex.onChange(storageName + '.' + _this5.key, function (storage) {
            var newState = _.pick(Simplex, storageNames);

            if (!_.isEqual(_this5.state, newState)) {
              _this5.setState(newState);
            }
          });
        });
        return _this5;
      }

      _createClass(Connected, [{
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
          var _this6 = this;

          storageNames.forEach(function (storageName) {
            Simplex.remove(storageName + '.' + _this6.key);
          });
        }
      }, {
        key: "render",
        value: function render() {
          return React.createElement(Component, _extends({}, this.props, this.state));
        }
      }]);

      return Connected;
    }(React.Component);

    return Connected;
  }

  return {
    Simplex: Simplex,
    SimplexConnect: SimplexConnect,
    SimplexStorage: SimplexStorage,
    SimplexMapToProps: SimplexMapToProps,
    Storage: Simplex.driver
  };
}(),
    Simplex = _ref.Simplex,
    SimplexConnect = _ref.SimplexConnect,
    SimplexStorage = _ref.SimplexStorage,
    SimplexMapToProps = _ref.SimplexMapToProps,
    Storage = _ref.Storage;

exports.Storage = Storage;
exports.SimplexMapToProps = SimplexMapToProps;
exports.SimplexStorage = SimplexStorage;
exports.SimplexConnect = SimplexConnect;
exports.Simplex = Simplex;
