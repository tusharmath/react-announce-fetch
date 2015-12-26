/**
 * Created by tushar.mathur on 26/12/15.
 */

'use strict'

import test from 'ava'
import hydrate from '../src/hydrate'
test(t => {
    const out = []
    class Mock {}
    const fakeStore = {hydrate: x => out.push(x)}
    const MockH = hydrate({stores:[fakeStore]}, Mock)
    const m = new MockH()
    m.componentWillMount()
    m.componentWillUnmount()
    t.same(out, [1, -1])
})

