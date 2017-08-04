# react-simplex
React storage


 [github](https://github.com/bumkaka/react-simplex)


# Install:
```
npm i --save react-simplex
```
```
import { Simplex, SimplexConnect, SimplexMapToProps } from 'react-simplex';
Simplex.init('user',{},true);
Simplex.init('todos',{},true);

```


# 1. SimplexConnect

### App.js

```javascript
import { Simplex } from 'react-simplex';
Simplex.init('user',{},true); //Define some storage scope with name 'user', value = {}, synch with localStorage = true
```


### UserInfo.jsx - react component
```javascript
import { SimplexConnect } from 'react-simplex';
import React from 'react'

class UserInfo extends React.Component{
  render(){
    return(
      <div>
        <span>{ this.props.user.login }</span>
        <span>{ this.props.user.name }</span>
      </div>
    );
  }
};

export default SimplexConnect( UserInfo, ['user'] );  //Connect component UserInfo to Simplex user scope
```


### Change storage

```javascript
Simplex.user = {
  name: 'Alex',
  login: 'Bumkaka'
}
```


# 2. SimplexMapToProps

## App.js

```javascript
import { Simplex } from 'react-simplex';
Simplex.init('todos', [], false); //Define some storage scope
```


## Todos.jsx
```javascript
import { SimplexMapToProps } from 'react-simplex';

class Todos extends React.Component{
  render(){
    return(
      <div>
        <span>{ this.props.todos_count } / { this.props.not_finished_count }</span>
		
		{ 
		  this.props.todos.map( ( todo, i)=>{
			return <div key={i}>{ todo.title }</div>
		  })
		}
      </div>
    );
  }
});

export default SimplexMapToProps( Component, ( storage, current_props )=>{
  return {
    todos: storage.todos,
    todos_count: storage.todos.length,
    not_finished_count: storage.todos.filter( ( todo )=>{
            return !todo.done;
        }).length
  }
});
```


### Change storage

```javascript
Simplex.todos = [
	{title: 'tests'},
	{title: 'fix'},
	{title: 'update readme'},
	{title: 'update version'},
	{title: 'publish'}
]
or
Simplex.set('todos', [
	{title: 'tests'},
	{title: 'fix'},
	{title: 'update readme'},
	{title: 'update version'},
	{title: 'publish'}
])
```

# General
1. import Simplex and connector
2. Init new scope. **Simplex.init( ScopeName, DefaultValue, SyncWithLocalStorage[ ture||false ] )**;
3. **Connect** React Component to Simplex scopes by SimplexConnect or SimplexMapToProps


##### connect by SimplexConnect
```javascript
SimplexConnect( Component, ['scope1' , 'scope2', 'scope3' ]);
```

##### connect by SimplexMapToProps.
```javascript
var Component = SimplexMapToProps( Component, ( storage, current_props )=>{
  return {
    todos: storage.todos,
    todos_count: storage.todos.length,
    not_finished_count: storage.todos.filter( ( todo )=>{
            return !todo.done;
        }).length
  }
});


//with route
<Route path="/todo_detail/:id" components={{page: Page}}/>
...
...
var Page = SimplexMapToProps( Page, ( state, props )=>{
  return {
    element: storage.todos.filter( ( todo )=>{
      return todo.id == props.some_component_props_id;
    })[0]
  }
});

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
Simplex.users = users;
or
Simplex.set('users', users) ;

//you can use to update all components
Simplex.trigger();





//Update specific key object type storage
Simplex.user = {
  name: 'Daniel',
  age: 21,
  email: 'todo@simplex.com',
  count: 12
}

Simplex.update('user',{
  name: 'Alex'
});
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

v1.1.0
- Add "SimplexMapToProps" connector to a component

v1.1.1
- fix trigger method

v1.1.2
- pass component props to SimplexMapToProps  

v1.1.3
- fix pass props on update component

v1.2.0
- add support React Native
- add tests
- now components re-render only if subscribed data will be changed
- ES6

v1.2.1
- fix AsyncStorage integration

v.1.2.2 
- fix readme
- move react-native & react dependencies to devDependencies