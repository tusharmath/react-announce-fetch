/**
 * Created by tushar.mathur on 24/12/15.
 */

'use strict'

import test from 'ava'
import createDataStore from '../src/createDataStore'
import { ReactiveTest, TestScheduler, Observable } from 'rx'
const {onNext} = ReactiveTest

var fetched = []
const fetch = x => {
  fetched.push(x)
  return Observable.just(x.a + 1000)
}
test.beforeEach(() => fetched = [])
test(t => {
  const out = []
  const scheduler = new TestScheduler()
  const paramsStream = scheduler.createHotObservable(
    onNext(210, {url: {a: 1}}),
    onNext(210, {url: {a: 2}}),
    onNext(210, {url: {a: 3}}),
    onNext(210, null),
    onNext(210, {url: {a: 4}})
  )
  const store = createDataStore(fetch, paramsStream, {})
  store.hydrate(1)
  store.getDataStream().subscribe(x => out.push(x))
  scheduler.startScheduler(() => paramsStream)
  t.same(out, [
    {},
    1001,
    1002,
    1003,
    1004
  ])
})

test('reload:hydrated', t => {
  const out = []
  const fetch = x => Observable.just(x.a + 1000)
  const scheduler = new TestScheduler()
  const paramsStream = scheduler.createHotObservable(
    onNext(210, {url: {a: 1}}),
    onNext(212, {url: {a: 2}}),
    onNext(213, {url: {a: 3}}),
    onNext(214, {url: {a: 3}}),
    onNext(215, null),
    onNext(216, {url: {a: 4}})
  )
  const store = createDataStore(fetch, paramsStream, {})
  store.getDataStream().subscribe(x => out.push(x))
  store.hydrate(1)
  scheduler.startScheduler(() => paramsStream)
  store.reload()
  t.same(out, [
    {},
    1001,
    1002,
    1003,
    1003,
    1004,
    1004
  ])
})

test('reload:unhydrated', t => {
  const out = []
  const scheduler = new TestScheduler()
  const paramsStream = scheduler.createHotObservable(
    onNext(210, {url: {a: 1}}),
    onNext(212, {url: {a: 2}}),
    onNext(213, {url: {a: 3}}),
    onNext(214, {url: {a: 3}}),
    onNext(215, null),
    onNext(216, {url: {a: 4}})
  )
  const store = createDataStore(fetch, paramsStream, {})
  store.getDataStream().subscribe(x => out.push(x))
  scheduler.startScheduler(() => paramsStream)
  store.reload()
  t.same(out, [{}])
})

test('hydrated', t => {
  const out = []
  const scheduler = new TestScheduler()
  const paramsStream = scheduler.createHotObservable(
    onNext(210, {url: {a: 1}}),
    onNext(212, {url: {a: 2}}),
    onNext(213, {url: {a: 3}}),
    onNext(214, {url: {a: 3}}),
    onNext(215, null),
    onNext(216, {url: {a: 4}})
  )
  const store = createDataStore(fetch, paramsStream, {})
  store.getDataStream().subscribe(x => out.push(x))
  scheduler.startScheduler(() => paramsStream)
  store.hydrate(1)
  t.same(out, [{}, 1004])
})

test('hydrated:no-param', t => {
  const out = []
  const fetch = x => Observable.just(x.a + 1000)
  const scheduler = new TestScheduler()
  const paramsStream = scheduler.createHotObservable(onNext(210, {url: {a: 1}}))
  const store = createDataStore(fetch, paramsStream, 1000)
  store.getDataStream().subscribe(x => out.push(x))
  store.hydrate()
  scheduler.startScheduler(() => paramsStream)
  t.same(out, [1000, 1001])
})

test('no fetch on increase in hydration', t => {
  const out = []
  const scheduler = new TestScheduler()
  const paramsStream = scheduler.createHotObservable(
    onNext(200, {url: {a: 1}}),
    onNext(212, {url: {a: 2}})
  )
  const store = createDataStore(fetch, paramsStream, {})
  store.getDataStream().subscribe(x => out.push(x))
  store.hydrate(1)
  scheduler.startScheduler(() => paramsStream)
  store.hydrate(1)
  store.hydrate(1)
  store.hydrate(1)

  t.same(out, [{}, 1001, 1002])
})

test('getStateStream', t => {
  const out = []
  const scheduler = new TestScheduler()
  const paramsStream = scheduler.createHotObservable(
    onNext(210, {url: {a: 1}}),
    onNext(212, {url: {a: 2}}),
    onNext(213, {url: {a: 3}}),
    onNext(214, {url: {a: 3}}),
    onNext(215, null),
    onNext(216, {url: {a: 4}})
  )
  const store = createDataStore(fetch, paramsStream, {})
  store.hydrate(1)
  store.getStateStream({}).subscribe(x => out.push(x))
  scheduler.startScheduler(() => paramsStream)
  t.same(out, [
    {state: 'BEGIN'},
    {state: 'END'},
    {state: 'BEGIN'},
    {state: 'END'},
    {state: 'BEGIN'},
    {state: 'END'},
    {state: 'BEGIN'},
    {state: 'END'},
    {state: 'BEGIN'},
    {state: 'END'}
  ])
})

test('initial value', t => {
  const out = []
  const fetch = x => Observable.just(x.a + 1000)
  const scheduler = new TestScheduler()
  const paramsStream = scheduler.createHotObservable(
    onNext(210, {url: {a: 1}}),
    onNext(212, {url: {a: 2}})
  )
  const store = createDataStore(fetch, paramsStream, 999)
  store.hydrate(1)
  store.getDataStream().subscribe(x => out.push(x))
  scheduler.startScheduler(() => paramsStream)
  t.same(out, [
    999,
    1001,
    1002
  ])
})

test('distinct request', t => {
  const out = []
  const fetch = x => Observable.just(x.a.aa + 1000)
  const scheduler = new TestScheduler()
  const val = [
    {url: {a: {aa: 0}}},
    {url: {a: {aa: 1}}},
    {url: {a: {aa: 2}}},
    {url: {a: {aa: 3}}},
    {url: {a: {aa: 4}}},
    {url: {a: {aa: 4}}}
  ]

  const paramsStream = scheduler.createHotObservable(
    onNext(210, val[0]),
    onNext(211, val[1]),
    onNext(212, val[2]),
    onNext(213, val[3]),
    onNext(214, val[3]),
    onNext(215, val[4]),
    onNext(216, val[5])
  )
  const store = createDataStore(fetch, paramsStream, 9000)
  store.hydrate(1)
  store.getDataStream().subscribe(x => out.push(x))
  scheduler.startScheduler(() => paramsStream)
  t.same(out, [
    9000,
    1000,
    1001,
    1002,
    1003,
    1004,
    1004
  ])
})

test('sync()', t => {
  const out = []
  const fetch = x => Observable.just(x + 1000)
  const scheduler = new TestScheduler()
  const paramsStream = scheduler.createHotObservable(
    onNext(200, {url: 10}),
    onNext(210, {url: 11}),
    onNext(220, {url: 12}),
    onNext(230, {url: 13}),
    onNext(240, {url: 13}),
    onNext(250, {url: 14}),
    onNext(260, {url: 15})
  )
  const store = createDataStore(fetch, paramsStream, 9000)
  store.getDataStream().subscribe(x => out.push(x))
  const sync = store.sync()
  sync.onNext({event: 'WILL_MOUNT'})
  scheduler.advanceBy(235)
  sync.onNext({event: 'WILL_UNMOUNT'})
  scheduler.advanceBy(250)
  t.same(out, [
    9000,
    1010,
    1011,
    1012,
    1013
  ])
})
