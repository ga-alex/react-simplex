# react-simplex
React storage

All you need
1. Define scope
2. connect React Component to Simplex scopes
3. Change Simplex scope
4. Again change :)


# 1. Use with SimplexConnect.


### App.js

```javascript
import { Simplex } from 'react-simplex';
Simplex.set('user'); //Define some storage scope
```


### UserInfo.jsx - react component
```javascript
import { SimplexConnect } from 'react-simplex';
var UserInfo = React.createClass({
    getInitialState() {
        return this.props;
    },

    render(){
        return(
            <div>
                <span>{ this.props.user.login }</span>
                <span>{ this.props.user.name }</span>
            </div>
        );
    }
});
UserInfo = SimplexConnect( UserInfo, ['user'] );  //Connect component UserInfo to Simplex user scope
export default UserInfo;
```


### Execute to make effect

```javascript
Simplex.user = {
    name: 'Alex',
    login: 'Bumkaka'
}
```


# 1. Manual use.

## App.js

```javascript
import { Simplex } from 'react-simplex';
Simplex.set('user'); //Define some storage scope
```


##UserInfo react component
```javascript
import { SimplexConnect } from 'react-simplex';

var UserInfo = React.createClass({
    getInitialState() {
        return {
            user: Simplex.user     //Set default state from Simplex user scope
        }
    },

    componentDidMount: function(){
        Simplex.onChange( 'user.UserInfo',  ( scope ) => {      //Subscribe to simlex scope with namespace
            this.setState( scope );
        });
    },
    
    componentWillUnmount: function() {
        Simplex.remove( 'user.UserInfo' );  //Unsubscribe from simplex scope
    },
    
    render(){
        return(
            <div>
                <span>{ this.props.user.login }</span>
                <span>{ this.props.user.name }</span>
            </div>
        );
    }
});

UserInfo = SimplexConnect( UserInfo, ['user'] );  //Connect component UserInfo to Simplex user scope

export default UserInfo;
```


### Execute to make effect

```javascript
Simplex.user = {
    name: 'Alex',
    login: 'Bumkaka'
}

```

# General
1. No need actions, dispatchers etc.
2. Simplex storage will defined in global **by default**
3. Define new scope before use. **Simplex.set('users')**;
4. **Connect** React Component to Simplex scopes
```javascript
SimplexConnect( Component, ['scope1' , 'scope2', 'scope3' ]) //All described scopes will listen
```
3. Simplex.**onChange**( scopeName, callback( scope ) )
- scopeName - use namespace, "user.ComponentName","user.ComponentName" + key etc..  When use Simplex.remove( "user.ComponentName" ), will be removed only this listener
4. Simplex.**remove**( scopeName ) - remove listener
5. Simplex.user = { some object } - will change scope and fire subscribed listeners ( setter )
6. **For update** scope you need:
```javascript
var users = Simplex.users; //get scope
users.push{ name: "Bob" }; //change
Simplex.users = users; //set new scope; 

alternative
Simplex.set('users', users)
```
7. `Remeber - GET -> CHANGE -> SET. Direct change like Simplex.users.push() does't work as expected, it will be changed in Simplex - but not fire listeners. `



### Versions:

v1.0.1
- Fix minify

v1.0.2
- Fix browserify & publish npm troubles
