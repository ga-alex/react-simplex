/* jslint node: true */
/* jshint esnext : true */
/* jslint indent: 2 */
const _ = require('underscore');
const cloneDeep =  require('lodash.clonedeep');

const { Simplex, SimplexConnect, SimplexStorage, SimplexMapToProps, Storage } = (() => {

  class StoragePolyFill {
    constructor() {
      this.storage = {};
    }
    getItem(name, callback) {
      if (callback) {
        callback({}, this.storage[name]);
      } else {
        return this.storage[name];
      }
    }
    setItem(name, value, callback) {
      this.storage[name] = value;
      if (callback) {
        callback();
      }
    }
  }


  var GLOBAL_EVENT_NAME = 'any';

  const Key = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  const isNode = () => {
    return typeof window === 'undefined';
  };

  let React = isNode() ? global.React : window.React;

  if (typeof React == 'undefined') {
    React = require('react');
  }




  class SimplexStorage {
    constructor() {
      this.listeners = [];
      this.Storage = {};
      this.StorageDefaults = {};
      this.sync = {};
      this.setStorageDriver(new StoragePolyFill())
    }

    setStorageDriver(storageDriver, _async = false) {
      this.driverAsync = _async;
      this.driver = storageDriver;
    }

    reset(name) {
      if (name) {
        this.set(name, cloneDeep(this.StorageDefaults[name]));
      } else {
        for (const n in this.StorageDefaults) {
          this.set(n, cloneDeep(this.StorageDefaults[n]));
        }
      }
    }

    init(name, default_value = null, sync = false) {
      return new Promise((resolve, reject) => {
        this.StorageDefaults[name] = cloneDeep(default_value);
        this.Storage[name] = cloneDeep(default_value);
        this.sync[name] = sync;


        if (!this.hasOwnProperty(name)) {
          Object.defineProperty(this, name, {
            set: (scope) => {
              this.set(name, scope);
            },
            get: (prop) => {
              return this.Storage[arguments[0]];
            }
          });
        }

        if (sync) {
          try {
            let storage_value = cloneDeep(default_value);

            if (this.driverAsync) {
              this.driver.getItem('SIMPLEX_' + name, (err, result) => {
                if (result !== undefined){
                  storage_value = JSON.parse(result);
                }
                this.Storage[name] = result !== undefined ? storage_value : cloneDeep(default_value);
                Simplex.trigger();
                resolve();
              });
            } else {
              const data = this.driver.getItem('SIMPLEX_' + name);
              if (data){
                storage_value = JSON.parse(this.driver.getItem('SIMPLEX_' + name));
              }
              this.Storage[name] = data !== undefined ? storage_value : cloneDeep(default_value);
              resolve();
            }
          } catch (e) {
            resolve();
            console.log(e)
            console.error('Simplex: can`t sync data from localStorage for ' + name);
          }
        } else {
          resolve();
        }
      });
    }


    get(name) {
      if (Array.isArray(this.Storage[name])) {
        return this.Storage[name].slice(0)
      } else {
        return cloneDeep(this.Storage[name])
      }
    }

    update(name, data) {

      if (!Array.isArray(this.Storage[name]) && typeof this.Storage[name] === 'object') {
        this.set(name, { ...this.Storage[name], ...data });
        return;
      }

      this.set(name, cloneDeep(data));
    }

    set(name, scope = []) {
      this.Storage[name] = scope;
      if (this.sync[name]) {
        if (this.driverAsync) {
          this.driver.setItem('SIMPLEX_' + name, JSON.stringify(this.Storage[name]), () => {
            this.trigger(name);
          });
        } else {
          this.driver.setItem('SIMPLEX_' + name, JSON.stringify(this.Storage[name]));
          this.trigger(name);
        }
      } else {
        this.trigger(name);
      }
    }

    onChange() {
      let name = '',
        callback = () => { };

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

    trigger(name = GLOBAL_EVENT_NAME) {
      var result = null;

      this.listeners.forEach((event) => {
        if (event.callback) {
          if (event.name.indexOf(GLOBAL_EVENT_NAME) === 0) {
            result = event.callback.call({}, this.Storage);
          } else {
            if (event.name.indexOf(name) === 0) {
              result = event.callback.call({}, { [name]: this.Storage[name] });
            }
          }
        }
      });

      return result;
    }


    remove(name) {
      for (var i in this.listeners) {
        if (this.listeners[i].name == name) {
          delete this.listeners[i];
        }
      }
      this.listeners = this.listeners.filter(function (e) { return e; });
    }

  }

  let Simplex = new SimplexStorage();




  function SimplexMapToProps(Component, MapStorageToPropsFunction) {
    if (typeof MapStorageToPropsFunction != 'function') {
      MapStorageToPropsFunction = (storage) => cloneDeep(storage)
    }

    class Connected extends React.Component {
      constructor(props) {
        super(props);
        const p = props || this.props; //React update capability

        let newMappedProps = MapStorageToPropsFunction(Simplex.Storage, props);
        this.state = cloneDeep(newMappedProps);
        this.key = Key();

        Simplex.onChange(GLOBAL_EVENT_NAME + '.' + this.key, (storage) => {
          let newMappedProps = MapStorageToPropsFunction(Simplex.Storage, props, this.state);
          // newMappedProps = cloneDeep(newMappedProps);
          if (!_.isEqual(this.state, newMappedProps)) {
            this.setState(cloneDeep(newMappedProps));
          }
        });
      }

      componentWillUnmount() {
        Simplex.remove(GLOBAL_EVENT_NAME + '.' + this.key);
      }

      render() {
        return <Component {...this.props} {...this.state} />;
      }
    }

    return Connected;
  }





  function SimplexConnect(Component, storageNames = []) {
    if (!Array.isArray(storageNames)) {
      console.error('SimplexConnect props must be an array');
      return;
    }

    class Connected extends React.Component {
      constructor(props) {
        super();
        this.state = _.pick(Simplex, storageNames);
        this.key = Key();

        storageNames.forEach((storageName) => {
          Simplex.onChange(storageName + '.' + this.key, (storage) => {
            let newState = _.pick(Simplex, storageNames);
            if (!_.isEqual(this.state, newState)) {
              this.setState(newState);
            }
          });
        });

      }

      componentWillUnmount() {
        storageNames.forEach((storageName) => {
          Simplex.remove(storageName + '.' + this.key);
        });
      }

      render() {
        return <Component {...this.props} {...this.state} />;
      }
    }

    return Connected;
  }

  return { Simplex, SimplexConnect, SimplexStorage, SimplexMapToProps, Storage: Simplex.driver };
})();

export { Simplex, SimplexConnect, SimplexStorage, SimplexMapToProps, Storage };
