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


An HTTP based `reactive` data store. Essentially it takes in an input stream  which represents the **HTTP Request Stream** (an Rx.Observable), and returns a **Response stream** (an Rx.Observable).

### Installation
```
npm install react-announce-fetch --save
```

### Example

```javascript
import Rx from 'rx'

import {create, toJSON} from 'react-announce-fetch'
import {connect} from 'react-announce-connect'
import {Component} from 'react'

const users = create(Rx.Observable.just(['/api/users', {method: 'GET'}]))

@connect(toJSON(users).pluck('json'))
UsersList extends Component {
  render () {
    const users = this.state.users
    return <ul>{users.map(x => <li>{x.name}</li>)}</ul>
  }
}

```

## Functions

* [create(request, [fetch])](#create) ⇒ <code>[Observable](#external_Observable)</code>
* [toJSON(response)](#toJSON) ⇒ <code>[Observable](#external_Observable)</code>

## External

* [Observable](#external_Observable)
* [Response](#external_Response)
* [fetch](#external_fetch)

<a name="create"></a>

## create(request, [fetch]) ⇒ <code>[Observable](#external_Observable)</code>
Takes in `request` parameters that will be used to call the [fetch](#external_fetch) function.
The request params is essentially the arguments to the [fetch](#external_fetch) function — `[url, options]`.
Internally the request observable is used as follows:
```js
request.flatMap(params => fetch.apply(null, params))
```
##### Performance:
Though you can simply use the code above this module a couple of extra things to optimize interms of making HTTP requests.

1. API requests are only made once per notification on the request stream, irrespective of how many subscribers have subscribed to it.
Once a response is received it is shared by all its subscribers.

2. No API requests must be made until there is at least one subscriber on the response stream.
Once there is a subscriber only one request should be made with the latest value on the request stream.

3. In case a subscriber disposes and resubscribes later in time, it should get the most recent response.

**Kind**: global function  
**Returns**: <code>[Observable](#external_Observable)</code> - Emits the Response Object that returned by [fetch](#external_fetch)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| request | <code>[Observable](#external_Observable)</code> |  | Request stream that emits params for the [fetch](#external_fetch) function as an array. |
| [fetch] | <code>function</code> | <code>window.fetch.bind(window)</code> | Optional custom fetch method |

<a name="toJSON"></a>

## toJSON(response) ⇒ <code>[Observable](#external_Observable)</code>
Create a [Response](#external_Response) stream where the [json()](https://developer.mozilla.org/en-US/docs/Web/API/Body/json) method is already called upon.
It makes sure that json parsing is only done once and the result is shared amongst everyone.

**Kind**: global function  
**Returns**: <code>[Observable](#external_Observable)</code> - Maps [Response](#external_Response) to a JS object containing `json` and the original `response`.  

| Param | Type | Description |
| --- | --- | --- |
| response | <code>[Observable](#external_Observable)</code> | Response stream that is returned by [create](#create) |

<a name="external_Observable"></a>

## Observable
An observable is an interface that provides a generalized mechanism for push-based notification,
also known as observer design pattern.

**Kind**: global external  
**See**: [RxJS Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)  
<a name="external_Response"></a>

## Response
Represents the response to a request in the [fetch](#external_fetch) API.

**Kind**: global external  
**See**: [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)  
<a name="external_fetch"></a>

## fetch
`window.fetch` is an easier way to make web requests and handle responses than using `XMLHttpRequest`.
It returns a promise and is easily consumed by [Rx](https://github.com/Reactive-Extensions/RxJS)
using the [flatMap](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/selectmany.md) operator.

**Kind**: global external  
**See**: [fetch polyfill](https://github.com/github/fetch)  
