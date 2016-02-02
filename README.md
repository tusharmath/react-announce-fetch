# react-announce-fetch[![Build Status](https://travis-ci.org/tusharmath/react-announce-fetch.svg?branch=master)](https://travis-ci.org/tusharmath/react-announce-fetch) [![npm](https://img.shields.io/npm/v/react-announce-fetch.svg)]() [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
a [react-announce](https://github.com/tusharmath/react-announce) declarative to create REST based data stores

Enables developers to create a shared data resource that can be used by multiple components.

### Installation
```
npm install react-announce-fetch --save
```

### Create a data store
This can be done using the factory method — `create()`. It takes in only one param, which represents the request stream. The stream must emit notifications containing all the props required by the [fetch](https://github.com/github/fetch) api.


### Usage

```javascript
import {create} from 'react-announce-fetch'
import {connect} from 'react-announce-connect'
import {hydrate} from 'react-announce-hydate'

import {BehaviorSubject} from 'rx'
import {Component} from 'react'

const requestStream = new BehaviorSubject({url: '/api/users'})
const initialValue = {users: [], page: 0}
const users = create(requestStream)

// users data store can be used like any other stream via the connect module
@connect({users: users.getJSONStream()})

// Using @hydrate binds the store to the component's lifecycle events.  
@hydrate(users.getComponentLifeCycleObserver())
Users extends Component {
  render () {
    return (
      <ul>
        {this.state.users.map(x => <li>{x.name}</li>)}
      </ul>
    )    
  }
}

// Keep refreshing the user store every second. Store stops getting updated automatically when the component Users unmounts.
setInterval(() => users.reload(), 1000)


// Get request state stream
users.getStateStream(x => console.log(x))

/*
OUTPUTS

BEGIN
END

*/
```

## API create(observable, options)
`create` takes in two parameters. An `observable` which basically is the request stream that emits notifications in the of following schema format —

**Sample Schema for Request Stream**
```javascript
{
  url: `/api/users`,
  method: `POST` // Defaults to get
  body: JSON.stringify({name: 'Godzilla!', age: 390})
}
```

*options:* 
- `hot`: `true|false` when true, the requests are immediately made and the store doesn't wait for any component to be mounted/unmounted.

## API store.prototype
- `getStateStream()` Exposes an observable that emits `BEGIN` when the request starts and `END` when it finishes.
- `getResponseStream()` Exposes the response of the HTTP request that is made every time the request stream fires an event.
- `getJSONStream()` Exposes the `json` data from the response stream (JSON parsing is async). 
- `reload()` Forcefully refreshes the store. By default requests are only made when the request stream fires an event. In some cases one might want to manually refresh the store.
- `dispose()` Disposes the observer to the request stream. All future changes to the request stream are ignored.
- `getComponentLifeCycleObserver()` Exposes an observer that listens to the component life cycle stream. This can be  use to create a `cold` data store. Compatable with events dispatched by [react-announce](https://github.com/tusharmath/react-announce#getcomponentstreamstream-observable-dispose-function)

## Cold Data Stores
The stores that only start refreshing themselves once they are hydrated via some component's lifecyle events. The main idea is that if the data store should not be making HTTP request and updating the state of an `UNMOUNTED` component with the response. So they remain dormant until a component starts listening to them.

```javascript
const store = create(new Rx.Observable.Subject())
```

## Hot Data Stores
These stores just start firing HTTP requests and keep updating themselves whenever there is a notification from the requests stream. They are not linked to any component.

```javascript
const store = create(new Rx.Observable.Subject(), {hot: true})
```
