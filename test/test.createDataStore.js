/**
 * Created by tushar.mathur on 24/12/15.
 */

'use strict'

import test from 'ava'
import createDataStore from '../src/createDataStore'
import { ReactiveTest, TestScheduler, Observable } from 'rx'
const {onNext} = ReactiveTest
test(t => {
  const fetched = []
  const out = []
  const fetcher = x => {
    fetched.push(x)
    return Observable.just(x.a + 1000)
  }
  const scheduler = new TestScheduler()
  const paramsStream = scheduler.createHotObservable(
    onNext(210, {a: 1}),
    onNext(210, {a: 2}),
    onNext(210, {a: 3}),
    onNext(210, null),
    onNext(210, {a: 4})
  )
  const store = createDataStore(fetcher, paramsStream, {})
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
  const fetcher = x => Observable.just(x.a + 1000)
  const scheduler = new TestScheduler()
  const paramsStream = scheduler.createHotObservable(
    onNext(210, {a: 1}),
    onNext(212, {a: 2}),
    onNext(213, {a: 3}),
    onNext(214, {a: 3}),
    onNext(215, null),
    onNext(216, {a: 4})
  )
  const store = createDataStore(fetcher, paramsStream, {})
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
  const fetched = []
  const out = []
  const fetcher = x => {
    fetched.push(x)
    return Observable.just(x.a + 1000)
  }
  const scheduler = new TestScheduler()
  const paramsStream = scheduler.createHotObservable(
    onNext(210, {a: 1}),
    onNext(212, {a: 2}),
    onNext(213, {a: 3}),
    onNext(214, {a: 3}),
    onNext(215, null),
    onNext(216, {a: 4})
  )
  const store = createDataStore(fetcher, paramsStream, {})
  store.getDataStream().subscribe(x => out.push(x))
  scheduler.startScheduler(() => paramsStream)
  store.reload()
  t.same(out, [{}])
})

test('hydrated', t => {
  const fetched = []
  const out = []
  const fetcher = x => {
    fetched.push(x)
    return Observable.just(x.a + 1000)
  }
  const scheduler = new TestScheduler()
  const paramsStream = scheduler.createHotObservable(
    onNext(210, {a: 1}),
    onNext(212, {a: 2}),
    onNext(213, {a: 3}),
    onNext(214, {a: 3}),
    onNext(215, null),
    onNext(216, {a: 4})
  )
  const store = createDataStore(fetcher, paramsStream, {})
  store.getDataStream().subscribe(x => out.push(x))
  scheduler.startScheduler(() => paramsStream)
  store.hydrate(1)
  t.same(out, [{}, 1004])
})

test('hydrated:no-param', t => {
  const out = []
  const fetcher = x => Observable.just(x.a + 1000)
  const scheduler = new TestScheduler()
  const paramsStream = scheduler.createHotObservable(onNext(210, {a: 1}))
  const store = createDataStore(fetcher, paramsStream, 1000)
  store.getDataStream().subscribe(x => out.push(x))
  store.hydrate()
  scheduler.startScheduler(() => paramsStream)
  t.same(out, [1000, 1001])
})

test('no fetch on increase in hydration', t => {
  const fetched = []
  const out = []
  const fetcher = x => {
    fetched.push(x)
    return Observable.just(x.a + 1000)
  }
  const scheduler = new TestScheduler()
  const paramsStream = scheduler.createHotObservable(
    onNext(200, {a: 1}),
    onNext(212, {a: 2})
  )
  const store = createDataStore(fetcher, paramsStream, {})
  store.getDataStream().subscribe(x => out.push(x))
  store.hydrate(1)
  scheduler.startScheduler(() => paramsStream)
  store.hydrate(1)
  store.hydrate(1)
  store.hydrate(1)

  t.same(out, [{}, 1001, 1002])
})

test('getStateStream', t => {
  const fetched = []
  const out = []
  const fetcher = x => {
    fetched.push(x)
    return Observable.just(x.a + 1000)
  }
  const scheduler = new TestScheduler()
  const paramsStream = scheduler.createHotObservable(
    onNext(210, {a: 1}),
    onNext(212, {a: 2}),
    onNext(213, {a: 3}),
    onNext(214, {a: 3}),
    onNext(215, null),
    onNext(216, {a: 4})
  )
  const store = createDataStore(fetcher, paramsStream, {})
  store.hydrate(1)
  store.getStateStream({}).subscribe(x => out.push(x))
  scheduler.startScheduler(() => paramsStream)
  t.same(out, [
    {state: 'BEGIN', meta: {a: 1}},
    {state: 'END', meta: 1001},
    {state: 'BEGIN', meta: {a: 2}},
    {state: 'END', meta: 1002},
    {state: 'BEGIN', meta: {a: 3}},
    {state: 'END', meta: 1003},
    {state: 'BEGIN', meta: {a: 3}},
    {state: 'END', meta: 1003},
    {state: 'BEGIN', meta: {a: 4}},
    {state: 'END', meta: 1004}
  ])
})

test('initial value', t => {
  const out = []
  const fetcher = x => Observable.just(x.a + 1000)
  const scheduler = new TestScheduler()
  const paramsStream = scheduler.createHotObservable(
    onNext(210, {a: 1}),
    onNext(212, {a: 2})
  )
  const store = createDataStore(fetcher, paramsStream, 999)
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
  const fetcher = x => Observable.just(x.a.aa + 1000)
  const scheduler = new TestScheduler()
  const val = [
    {a: {aa: 0}},
    {a: {aa: 1}},
    {a: {aa: 2}},
    {a: {aa: 3}},
    {a: {aa: 4}},
    {a: {aa: 4}}
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
  const store = createDataStore(fetcher, paramsStream, 9000)
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
  const fetcher = x => Observable.just(x + 1000)
  const scheduler = new TestScheduler()
  const paramsStream = scheduler.createHotObservable(
    onNext(200, 10),
    onNext(210, 11),
    onNext(220, 12),
    onNext(230, 13),
    onNext(240, 13),
    onNext(250, 14),
    onNext(260, 15)
  )
  const store = createDataStore(fetcher, paramsStream, 9000)
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
