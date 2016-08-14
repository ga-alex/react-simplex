function SimplexStorage(){
    this.listeners = [];
    this.Storage = {};
}


SimplexStorage.prototype.get = function( name ){
    return this.Storage[ name ];
}

SimplexStorage.prototype.set = function( name, scope = [] ){

    if ( !this.hasOwnProperty( name ) ){

        Object.defineProperty( this, name, {
            set: ( scope ) => {
                this.Storage[ name ] = scope;
                this.trigger( name, scope );
            },
            get: ( prop )  => {
                return this.Storage[ arguments[0] ];
            }
        });
    }

    this.Storage[ name ] = scope;
    this.trigger( name, scope )
}

SimplexStorage.prototype.onChange = function( name , callback ){
    this.listeners.push( {name: name, callback: callback} );
}

SimplexStorage.prototype.trigger = function( name , scope ){
    var result = null;

    this.listeners.forEach(function(event) {
        if ( event.name.indexOf( name ) == 0 ) {
            if ( event.callback ){
                result = event.callback.call(scope,  { [name]: scope} );
            }
        }
    });
    return result;
}

SimplexStorage.prototype.remove = function( name ){
    for(var i in this.listeners){
        if ( this.listeners[i].name == name ){
            delete this.listeners[i];
        }
    }
    this.listeners = this.listeners.filter(function(e){return e});
}   

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
                Simplex.remove( prop + '.' + Key )
            });
        },

        render() {
            return <Component {...this.props} {...this.state} />;
        }
    });
    return Connected;
};




export { Simplex, SimplexConnect, SimplexStorage };