/*jslint node: true*/
/*jshint esnext : true */


function SimplexStorage(){
    this.listeners = [];
    this.Storage = {};
    this.sync = {};
}

SimplexStorage.prototype.get = function( name ){
    return this.Storage[ name ];
};

SimplexStorage.prototype.init = function( name, default_value = [], sync = false){
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
};

SimplexStorage.prototype.set = function( name, scope = [] ){
    this.Storage[ name ] = scope;

    if ( this.sync[name] ) {
        localStorage.setItem( 'SIMPLEX_' + name, JSON.stringify( this.Storage[name] ) );
    }

    this.trigger( name );
};

SimplexStorage.prototype.onChange = function( name , callback ){
    this.listeners.push( {name: name, callback: callback} );
};

SimplexStorage.prototype.trigger = function( name ){
    var result = null;

    this.listeners.forEach( (event)=>{
        if ( event.name.indexOf( name ) === 0 ) {
            if ( event.callback ){
                result = event.callback.call({},  { [name]: this.Storage[name] } );
            }
        }
    });
    return result;
};

SimplexStorage.prototype.remove = function( name ){
    for(var i in this.listeners){
        if ( this.listeners[i].name == name ){
            delete this.listeners[i];
        }
    }
    this.listeners = this.listeners.filter(function(e){return e;});
}   ;

window.Simplex = new SimplexStorage();



var SimplexConnect = function(Component, props = [] ) {
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

export { Simplex, SimplexConnect, SimplexStorage };
