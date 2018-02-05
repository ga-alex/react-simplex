/* jslint node: true */
/* jshint esnext : true */
/* jslint indent: 2 */
import _ from 'underscore';
import cloneDeep from 'lodash.clonedeep';

const { Simplex, SimplexConnect, SimplexStorage, SimplexMapToProps, Storage } = ( () => {

class StoragePolyFill {
	constructor(){
	  this.storage = {};
	}
	getItem( name, callback ){
	  if ( callback ){
		callback( {}, this.storage[name] );
	  } else {
		return this.storage[name];
	  }
	}
	setItem( name, value, callback ){
	  this.storage[name] = value;
		if ( callback ){
			callback();
	  }
	}
}


  var GLOBAL_EVENT_NAME = 'any';

  const Key = ()=>{
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }

  const isNode = ()=>{
    return typeof window === 'undefined';
  };

  let React = isNode() ? global.React : window.React;

  if ( typeof React == 'undefined'){
    React = require('react');
  }




  class SimplexStorage{
    constructor() {
      this.listeners = [];
      this.Storage = {};
      this.sync = {};
			this.setStorageDriver( new StoragePolyFill() )
    }
    setStorageDriver (storageDriver, _async = false) {
			this.driverAsync = _async;
			this.driver = storageDriver;
		}

    init( name, default_value = [], sync = false ) {

      this.Storage[name] = default_value;
      this.sync[name] = sync;

      if ( !this.hasOwnProperty( name ) ){
        Object.defineProperty( this, name, {
          set: ( scope ) => {
            this.set( name, scope );
          },
          get: ( prop )  => {
            return this.Storage[ arguments[0] ];
          }
        });
      }

      if ( sync ){
        try {
          let storage_value = null;

					if (this.driverAsync) {
						this.driver.getItem( 'SIMPLEX_' + name, ( err, result )=>{
              storage_value = JSON.parse( result );
              this.Storage[name] = storage_value !== null ? storage_value : default_value;
							Simplex.trigger();
            });
					} else {
						storage_value = JSON.parse( this.driver.getItem( 'SIMPLEX_' + name ) );
            this.Storage[name] = storage_value !==null ? storage_value : default_value;
					}
        } catch(e){
          console.error('Simplex: can`t sync data from localStorage for ' + name);
        }
      }
    }


    get( name ){
			let data = cloneDeep(this.Storage[ name ])
      return data;
    }

    update( name, data ){
      let new_data = cloneDeep(Object.assign( {}, this.Storage[ name ], data ))
      this.set( name, new_data);
    }

    set( name, scope = [] ){
      this.Storage[ name ] = scope;
      if ( this.sync[name] ) {
        if (this.driverAsync) {
          this.driver.setItem( 'SIMPLEX_' + name, JSON.stringify(this.Storage[name]), () => {
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

    onChange(){
      let name = '',
      callback = ()=>{};

      switch( arguments.length ){
        case 1:
        name = GLOBAL_EVENT_NAME;
        callback = arguments[0];
        break;
        case 2:
        name     = arguments[0];
        callback = arguments[1];
        break;
      }
      this.listeners.push( {name: name, callback: callback} );
    }

    trigger( name = GLOBAL_EVENT_NAME){
      var result = null;

      this.listeners.forEach( (event)=>{
        if ( event.callback ){
          if ( event.name.indexOf( GLOBAL_EVENT_NAME ) === 0 ) {
            result = event.callback.call({},  this.Storage );
          } else {
            if ( event.name.indexOf( name ) === 0 ) {
              result = event.callback.call({},  { [name]: this.Storage[name] } );
            }
          }
        }
      });

      return result;
    }


    remove( name ){
      for(var i in this.listeners){
        if ( this.listeners[i].name == name ){
          delete this.listeners[i];
        }
      }
      this.listeners = this.listeners.filter(function(e){return e;});
    }

  }

  let Simplex = new SimplexStorage();




  function SimplexMapToProps( Component, MapStorageToPropsFunction ){
    if ( typeof MapStorageToPropsFunction != 'function' ){
      MapStorageToPropsFunction = (storage)=> cloneDeep(storage)
    }

    class Connected extends React.Component{
      constructor(){
        super();
				let newMappedProps = MapStorageToPropsFunction( Simplex.Storage, this.props );
        this.state = cloneDeep(newMappedProps);
        this.key = Key();
      }

      componentDidMount() {
        Simplex.onChange( GLOBAL_EVENT_NAME + '.' + this.key, ( storage )=>{
          let newMappedProps = MapStorageToPropsFunction( Simplex.Storage, this.props, this.state );
					newMappedProps = cloneDeep(newMappedProps)
					if ( !_.isEqual( this.state, newMappedProps) ) {
            this.setState( newMappedProps );
          }
        });
      }

      componentWillUnmount() {
        Simplex.remove( GLOBAL_EVENT_NAME + '.' + this.key );
      }

      render() {
        return <Component {...this.props} {...this.state} />;
      }
    }

    return Connected;
  }





  function SimplexConnect(Component, storageNames = [] ) {
    if ( !Array.isArray( storageNames ) ){
      console.error( 'SimplexConnect props must be an array' );
      return;
    }
    
    class Connected extends React.Component{
      constructor( props ){
        super();
        this.state = _.pick( Simplex, storageNames);
        this.key = Key();
      }

      componentDidMount() {
        storageNames.forEach( ( storageName )=>{
          Simplex.onChange( storageName + '.' + this.key, ( storage )=>{

            let newState = _.pick( Simplex, storageNames);
            if ( !_.isEqual( this.state, newState) ) {
              this.setState( newState );
            }

          });
        });
      }

      componentWillUnmount() {
        storageNames.forEach( ( storageName )=>{
          Simplex.remove( storageName + '.' + this.key );
        });
      }

      render() {
        return <Component {...this.props} {...this.state} />;
      }
    }

    return Connected;
  }

  return {Simplex, SimplexConnect, SimplexStorage, SimplexMapToProps, Storage:Simplex.driver};
})();

export { Simplex, SimplexConnect, SimplexStorage, SimplexMapToProps, Storage };
