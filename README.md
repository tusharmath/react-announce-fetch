# react-announce-fetch
[![Build Status](https://travis-ci.org/tusharmath/react-announce-fetch.svg?branch=master)](https://travis-ci.org/tusharmath/react-announce-fetch) [![npm](https://img.shields.io/npm/v/react-announce-fetch.svg)]() [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Coverage Status](https://coveralls.io/repos/github/tusharmath/react-announce-fetch/badge.svg?branch=master)](https://coveralls.io/github/tusharmath/react-announce-fetch?branch=master)

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
import {create, reload} from 'react-announce-fetch'
import {connect} from 'react-announce-connect'
import {asStream} from 'react-announce'

import {BehaviorSubject} from 'rx'
import {Component} from 'react'

const requestStream = new BehaviorSubject({url: '/api/users'})
const users = create(requestStream)

// users data store can be used like any other stream via the connect module
@connect({users: users.flatMap(x => x.toJSON())})

// Using @asStream binds the store to the component's lifecycle events.  
@asStream(users)
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
setInterval(() => reload(users), 1000)


```

## API create(observable)
`create()` takes in one parameter — an `observable` which basically is the request stream that emits notifications in the of following schema format —

**Sample Schema for Request Stream**
```javascript
{
  url: `/api/users`,
  method: `POST` // Defaults to get
  body: JSON.stringify({name: 'Godzilla!', age: 390})
}
```
`reload()` Forcefully refreshes the store. By default requests are only made when the request stream fires an event. In some cases one might want to manually refresh the store.
