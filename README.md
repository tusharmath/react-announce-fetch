# react-announce-fetch[![Build Status](https://travis-ci.org/tusharmath/react-announce-fetch.svg?branch=master)](https://travis-ci.org/tusharmath/react-announce-fetch)
a [react-announce](https://github.com/tusharmath/react-announce) declarative to create REST based data stores

### Installation
```
npm install react-announce-fetch --save
```

### Usage
This module exposes an API `createDataStore()` to create shared data stores with multiple components. It also makes sure that the stores are hydrated *whenever* the search params change and *only when* the linked components are mounted.

### Create a data store
This can be done using the factory method — `createDataStore()`. It takes in only one param, which represents the request stream. The stream must emit notifications constaining all the props required by the [fetch](https://github.com/github/fetch) api —

```javascript
import {createDataStore} from 'react-announce-fetch'
import {BehaviorSubject} from 'rx'

const requestParams = new BehaviorSubject({url: '/api/users'})
const users = createDataStore(searchParams.map(requestParams))
```


In this case `users`, exposes primarly two methods `getStream()` and `reload()`. The `getStream()` method exposes the data inside the store which is basically the HTTP Response, of the request made to `/api/users` — as a stream.

By default, the HTTP request is only made when there is a *real* change in the values emitted by the `requestParams`, *Change detection is done using strict equal to operator — `===`*. Sometimes, it is still required to reload the store, manually. For instance soon after creating a new user object, you might want to get the list of the users again, even though the request hasn't emitted a new value.

### Use with React

```javascript
import {connect} from 'react-announce-connect'
import {Component} from 'react'

// users data store can be used like any other stream via the connect module
@connect({users: users.getStream()})
Users extends Component {
  render () {
    return (
      <ul>
        {this.state.users.map(x => <li>{x.name}</li>)}
      </ul>
    )    
  }
}

```
