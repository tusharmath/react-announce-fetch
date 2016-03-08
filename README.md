# react-announce-fetch
[![Build Status][travis-svg]][travis]
[![npm][npm-svg]][npm]
[![semantic-release][semantic-release-svg]][semantic-release]
[![Coverage Status][coverage-svg]][coverage]

[travis-svg]:           https://travis-ci.org/tusharmath/react-announce-fetch.svg?branch=master
[travis]:               https://travis-ci.org/tusharmath/react-announce-fetch
[semantic-release-svg]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release]:     https://github.com/semantic-release/semantic-release
[coverage-svg]:         https://coveralls.io/repos/github/tusharmath/react-announce-fetch/badge.svg?branch=master
[coverage]:             https://coveralls.io/github/tusharmath/react-announce-fetch?branch=master
[npm-svg]:              https://img.shields.io/npm/v/react-announce-fetch.svg
[npm]:                  https://www.npmjs.com/package/react-announce-fetch


An HTTP based `reactive` data store. Essentially it takes in an input stream  which represents the **HTTP Request Stream** (an Rx.Observable), and returns a **Communication Bus** (an Rx.Subject). Communication bus is how one can `send` as well as `receive` different kinds of events.

### Installation
```
npm install react-announce-fetch --save
```

### Usage


```javascript
import Rx from 'rx'

import {create, reload} from 'react-announce-fetch'
import {asStream} from 'react-announce'
import {Component} from 'react'

const users = create(Rx.Observable.just(['/api/users', {method: 'GET'}]))

// Using @asStream binds the store to the components lifecycle events.  
@asStream(users)
UsersList extends Component {
  render () {
    return <div>Hi!</div>
  }
}

users.subscribe(x => console.log(x))

```

### How does it work?
[asStream]: https://github.com/tusharmath/react-announce#asstream

It basically makes an HTTP request if one of the components that it is listening to (for lifecycle events) mounts. Once the response is received it is not going to make anymore requests, no matter how many components its linked to via **@asStream()** until, the request stream fires another *distinct* new value.

Also, if none of the components are in mounted state and the request stream keeps firing with different values, no HTTP requests are going to be made, UNTILL one of the components mounts. In which case, the params of the last request would be used to make the HTTP request.


## API

### Events
The following two events are fired on the store —
- `REQUEST`: Fired as soon as the request is initiated.
- `RESPONSE`: Fired as soon as the response in completely received.

  ```javascript
  const users = create(Rx.Observable.just(['/api/users']))

  users.filter(x => x.event === 'REQUEST').pluck('args')
  users.filter(x => x.event === 'RESPONSE').pluck('args')
  ```

### create(observable)
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
### reload(store)
`reload()` Forcefully refreshes the store. By default requests are only made when the request stream fires an event.

```javascript
import {reload} from 'react-announce-fetch'
reload(store)
```

### toJSON(store)
`toJSON()` is a simple utility method that simply exposes the store as a stream of JSON responses.

```javascript
import {toJSON} from 'react-announce-fetch'
toJSON(store).subscribe(x => console.log(x))
```
