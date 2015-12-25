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


In this case `users`, exposes primarly two methods `getDataStream()` and `reload()`. The `getDataStream()` method exposes the data inside the store which is basically the HTTP Response, of the request made to `/api/users` — as a stream.

By default, the HTTP request is only made when there is a *real* change in the values emitted by the `requestParams`, *Change detection is done using strict equal to operator — `===`*. Sometimes, it is still required to reload the store, manually. For instance soon after creating a new user object, you might want to get the list of the users again, even though the request hasn't emitted a new value.

### Use with React


```javascript
import {connect} from 'react-announce-connect'
import {hydrate} from 'react-announce-fetch'
import {Component} from 'react'

// users data store can be used like any other stream via the connect module
@connect({users: users.getDataStream()})
@hydrate([users])
Users extends Component {
  render () {
    return (
      <ul>
        {this.state.users.map(x => <li>{x.name}</li>)}
      </ul>
    )    
  }
}

// Keep refresh the user store every second.
setInterval(() => users.reload(), 1000)

```

In the above example, the users store would keep getting refereshed every second and the `Users` component together with the other components that are *connected* to `users.getDataStream()`, would automatically get updated as soon as a new value would be received.

### Hydration
That setInterval is quite a cumbersome thing to manage. I need to be aware of if the `Users` component is mounted or not. If it isn't mounted then there is not point of keep making these HTTP requests. At the same time, I should also be aware of other components lifecycle, who are using the `users` data store. So that if any of them are in mounted state, I shall keep the setInterval going and as soon as none of them are in mounted state, I will clear the interval.

The `@hydrate` decorator does exactly that. It takes in a list of data stores as a parameter, and restricts them from making HTTP requests if the components are unmounted.

### getStateStream()
It's purpose is to expose a stream that emits a value `BEGIN` just before the HTTP request is being made and `END` once the api request is complete. This is pretty useful when you want to show a loader until the data received.

```

users.getStateStream(x => console.log(x))

/*
OUTPUTS

BEGIN
END

*/

```
