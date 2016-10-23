/*jslint node: true*/
/*jshint esnext : true */
/*jslint indent: 4 */
var GLOBAL_EVENT_NAME = 'any';

class SimplexStorage{
    constructor() {
        this.listeners = [];
        this.Storage = {};
        this.sync = {};
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
                let storage_value = JSON.parse( localStorage.getItem( 'SIMPLEX_' + name ) );
                this.Storage[name] = storage_value !== undefined && storage_value !== null ? storage_value : default_value;
            } catch(e){
                console.error('Simplex: can`t sync data from localStorage for ' + name);
            }
        }
    }


    get( name ){
        return this.Storage[ name ];
    }

    update( name, scope ){
        let new_scope = Object.assign( {}, this.Storage[ name ], scope );
        this.set( name, new_scope);
    }

    set( name, scope = [] ){
        this.Storage[ name ] = scope;

        if ( this.sync[name] ) {
            localStorage.setItem( 'SIMPLEX_' + name, JSON.stringify( this.Storage[name] ) );
        }

        this.trigger( name );
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


    remove( name = GLOBAL_EVENT_NAME ){
        for(var i in this.listeners){
            if ( this.listeners[i].name == name ){
                delete this.listeners[i];
            }
        }
        this.listeners = this.listeners.filter(function(e){return e;});
    }

}

window.Simplex = new SimplexStorage();









function SimplexMapToProps( Component, MapStorageToPropsFunction ){
    const Key = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });

    const Connected = React.createClass({

        componentDidMount() {
            Simplex.onChange( GLOBAL_EVENT_NAME + '.' + Key, ( scope )=>{
                this.setState( MapStorageToPropsFunction( Simplex.Storage, this.props ) );
            });
        },

        componentWillUnmount() {
            Simplex.remove( GLOBAL_EVENT_NAME + '.' + Key );
        },

        render() {
            var MappedProps = MapStorageToPropsFunction( Simplex.Storage, this.props );
            return <Component {...this.props} {...MappedProps} />;
        }
    });
    return Connected;
}












function SimplexConnect(Component, props = [] ) {
    if ( !Array.isArray( props ) ){
        console.error( 'SimplexConnect props must be an array' );
        return;
    }

    const Key = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });

    const Connected = React.createClass({
        getInitialState() {

            var DefaultState = {};
            props.forEach( ( prop )=>{
                DefaultState[ prop ] = Simplex[ prop ];
            });

            return DefaultState;
        },

        componentDidMount() {
            props.forEach( ( prop )=>{
                Simplex.onChange( prop + '.' + Key, ( scope )=>{
                    this.setState( scope );
                });
            });
        },

        componentWillUnmount() {
            props.forEach( ( prop )=>{
                Simplex.remove( prop + '.' + Key );
            });
        },

        render() {
            return <Component {...this.props} {...this.state} />;
        }
    });
    return Connected;
};

export { Simplex, SimplexConnect, SimplexStorage, SimplexMapToProps };
