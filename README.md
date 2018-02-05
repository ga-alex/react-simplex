# react-simplex
React storage


 [github](https://github.com/bumkaka/react-simplex)


# Install:
```
npm i --save react-simplex
```

For web app
```javascript
import { Simplex, SimplexConnect, SimplexMapToProps } from 'react-simplex';

Simplex.setStorageDriver(
  localStorage, // storage driver
  false         // driver is not async
)

Simplex.init('user',{},true);
Simplex.init('todos',{},true);

```


For react-native
```javascript
import { Simplex, SimplexConnect, SimplexMapToProps } from 'react-simplex';
import { AsyncStorage } from 'react-native';

Simplex.setStorageDriver(
  AsyncStorage, // storage driver
  true         // driver is async
)

Simplex.init('user',{},true);
Simplex.init('todos',{},true);

```
# SimplexMapToProps

## App.js

```javascript
import { Simplex } from 'react-simplex';

Simplex.init('todos', [], false); //Define some storage scope
```


## Todos.jsx
```javascript
import { SimplexMapToProps } from 'react-simplex';

class Todos extends Component{
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

export default SimplexMapToProps( Todos, ( storage, current_props )=>{
  return {
    todos: storage.todos,
    todos_count: storage.todos.length,
    not_finished_count: storage.todos.filter( ( todo )=>{
      return !todo.done;
    }).length
  }
});
```


### Put data to storage

```javascript
Simplex.todos = [
  {title: 'tests'},
  {title: 'fix'},
  {title: 'update readme'},
  {title: 'update version'},
  {title: 'publish'}
]


Simplex.set('todos', [
  {title: 'tests'},
  {title: 'fix'},
  {title: 'update readme'},
  {title: 'update version'},
  {title: 'publish'}
])
```
### Atention! Change exist storage type array
```javascript
Simplex.todos = [
  {title: 'tests'},
  {title: 'fix'},
  {title: 'update readme'},
  {title: 'update version'},
  {title: 'publish'}
]

Simplex.todos.push({
  title:
})

//After that changes data not pass to components
//you need to trigger onChange manualy
Simplex.trigger('todos')

or

const todos = Simplex.todos //imutable
todos.push({
  title:
})
Simplex.todos = todos;
```


### Change storage

```javascript
//Storage already have some data
Simplex.user = {
  name: 'Alex',
  token: 'asEkfjeE3rR',
  role: 3,
  email: 'test@test.ts',
  description: 'Some text'
}
```

To update 'user' storage we should do

```javascript
//Update will auto trigger onChange
Simplex.update('user', {
  description: 'New description'
});

or

//Direct access to keys not trigger onChange
Simplex.user.description = 'Some text'
Simplex.trigger('user') //this is important line

or

const user = Simplex.user
user.description = 'New description'
Simplex.user = user

```

## `Simplex.init(scopeName, data, sync)`
Init scope with default values **data**

`sync` - true|false  sync data with localstorage|asyncStorage


## `Simplex.set(scopeName, data)`

Set value of the defined scope

## `Simplex.update(scopeName, data)`

Update existing scope

## `Simplex.onChange(scopeName, callback)`

`scopeName` - can be with namespace 'user.NAMESPACE'

Subscribe to scope changes

## `Simplex.remove(scopeName)`

`scopeName` with namespace

remove listener 

## `Simplex.trigger(scopeName)`

`scopeName` - default *any*

Trigger scope changes