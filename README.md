# react-simplex
React storage


Simple Todo List on react & [react-simplex](https://github.com/bumkaka/react-simplex)

[Demo](http://react-simplex.ga-alex.com)
[Git](https://github.com/bumkaka/react-simplex-example)

# Install:
```
npm i --save react-simplex
```
```
import { Simplex, SimplexConnect } from 'react-simplex';

```


# 1. Use with SimplexConnect.


### App.js

```javascript
import { Simplex } from 'react-simplex';
Simplex.init('user',{},true); //Define some storage scope with name 'user', value = {}, synch with localStorage = true
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
Simplex.init('user', {}, false); //Define some storage scope
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
3. Init new scope before use. **Simplex.init( ScopeName, DefaultValue, SyncWithLocalStorage( ture||false ))**;
4. **Connect** React Component to Simplex scopes
```javascript
//connect to a specified scopes
SimplexConnect( Component, ['scope1' , 'scope2', 'scope3' ]);


//connect the entire Simplex to the component through mapToProps function.

SimplexMapToProps( Component, ( state )=>{
    return {
        todos: storage.todos,
        todos_count: storage.todos.length,
        not_finished_count: storage.todos.filter( ( todo )=>{ 
                return !todo.done;
            }).length
    }
})


```
3. Simplex.**onChange**( scopeName, callback( scope ) )
- scopeName - use namespace, "user.ComponentName","user.ComponentName" + key etc..  When use Simplex.remove( "user.ComponentName" ), will be removed only this listener
4. Simplex.**remove**( scopeName ) - remove listener
5. Simplex.user = { some object } - will change scope and fire subscribed listeners ( setter )
6. **For update** scope you need:

```javascript
//Update array type storage 
var users = Simplex.users; //get scope
users.push{ name: "Bob" }; //change
Simplex.users = users; //set new scope or Simplex.set('users', users) ; 




//Update object type storage 
Simplex.user = {
    name: 'Todo',
    age: 21,
    email: 'todo@simplex.com',
    count: 12
}

Simplex.update('user',{
    name: 'Simple todo app'
});



Simplex.user:
{
    name: 'Simple todo app',
    age: 21,
    email: 'todo@simplex.com',
    count: 12
}

```


### Versions:

v1.0.1
- Fix minify

v1.0.2
- Fix browserify & publish npm troubles

v1.0.5
- Rewrite readme.md

v1.0.6
- Change Simplex.trigger method
- Add Simplex.init method for scope name
- Add sync with localStorage

v1.0.7
- Add "update" method for objects
- Subscribe to any changes
- Add "SimplexMapToProps" connector to a component
