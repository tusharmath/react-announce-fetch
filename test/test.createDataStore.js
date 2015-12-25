/**
 * Created by tushar.mathur on 24/12/15.
 */

'use strict'

import test from 'ava'
import createDataStore from '../src/createDataStore'
import {ReactiveTest, TestScheduler, Observable} from 'rx'
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
  const store = createDataStore(paramsStream, fetcher)
  store.hydrate(1)
  store.getDataStream().subscribe(x => out.push(x))
  scheduler.startScheduler(() => paramsStream)
  t.same(out, [
    1001,
    1002,
    1003,
    1004
  ])
})

test('distinctChanges', t => {
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
  const store = createDataStore(paramsStream, fetcher)
  store.hydrate(1)
  store.getDataStream().subscribe(x => out.push(x))
  scheduler.startScheduler(() => paramsStream)
  t.same(out, [
    1001,
    1002,
    1003,
    1004
  ])
})

test('reload:hydrated', t => {
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
  const store = createDataStore(paramsStream, fetcher)
  store.hydrate(1)
  store.getDataStream().subscribe(x => out.push(x))
  scheduler.startScheduler(() => paramsStream)
  store.reload()
  t.same(out, [
    1001,
    1002,
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
  const store = createDataStore(paramsStream, fetcher)
  store.getDataStream().subscribe(x => out.push(x))
  scheduler.startScheduler(() => paramsStream)
  store.reload()
  t.same(out, [])
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
  const store = createDataStore(paramsStream, fetcher)
  store.getDataStream().subscribe(x => out.push(x))
  scheduler.startScheduler(() => paramsStream)
  store.hydrate(1)
  t.same(out, [1004])
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
  const store = createDataStore(paramsStream, fetcher)
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
    {state: 'BEGIN', meta: {a: 4}},
    {state: 'END', meta: 1004}
  ])
})
