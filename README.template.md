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

{{>main}}
