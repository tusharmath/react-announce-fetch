# react-announce-fetch
[![Build Status](https://travis-ci.org/tusharmath/react-announce-fetch.svg?branch=master)](https://travis-ci.org/tusharmath/react-announce-fetch) [![npm](https://img.shields.io/npm/v/react-announce-fetch.svg)]() [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Coverage Status](https://coveralls.io/repos/github/tusharmath/react-announce-fetch/badge.svg?branch=master)](https://coveralls.io/github/tusharmath/react-announce-fetch?branch=master)

Create REST based data-stores and bind it to a component.

### Installation
```
npm install react-announce-fetch --save
```

### Create a data store
This can be done using the factory method — `create()`. It takes in only one param, which represents the request stream. The stream must emit notifications containing all the props required by the [fetch](https://github.com/github/fetch) api.


### Usage

```javascript
import Rx from 'rx'

import {create, reload} from 'react-announce-fetch'
import {asStream} from 'react-announce'


import {Component} from 'react'

const users = create(Rx.Observable.just(['/api/users', {method: 'GET'}]))

// Using @asStream binds the store to the component's lifecycle events.  
@asStream(users)
Users extends Component {
  render () {
    return <div>Hi!</div>
  }
}

users.subscribe(x => console.log(x))

```

## API

### Events
The following two events are fired on the store —
- `FETCH_BEGIN`: Fired as soon as the request is initiated.
- `FETCH_END`: Fired as soon as the response in completely received.

  ```javascript
  const users = create(Rx.Observable.just(['/api/users']))

  users.filter(x => x.event === 'FETCH_BEGIN')
  users.filter(x => x.event === 'FETCH_END')
  ```

### store.create(observable)
`store.create()` takes in one parameter — an `observable` which basically is the request stream that emits notifications in the of following schema format —

**Sample Schema for Request Stream**
```javascript
[
  url: `/api/users`,
  {  
    method: `POST` // Defaults to get
    body: JSON.stringify({name: 'Godzilla!', age: 390})
  }
]
```
## reload()
`reload()` Forcefully refreshes the store. By default requests are only made when the request stream fires an event. In some cases one might want to manually refresh the store.
