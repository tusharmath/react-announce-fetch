/**
 * Created by tushar.mathur on 24/12/15.
 */

'use strict'
import {spy} from 'sinon'
import {TestScheduler, ReactiveTest} from 'rx'
import test from 'ava'
import {create} from '../src/main'
import {call} from 'funjector'
const {onNext, onCompleted} = ReactiveTest
const identity = x => x

test('calls fetch', t => {
  const fetch = spy(identity)
  const toObservable = () => fetch
  const sh = new TestScheduler()
  const request = sh.createHotObservable(
    onNext(210, ['a', 1]),
    onNext(220, ['b', 2])
  )
  call(create, toObservable, null, request)
    .subscribe(identity)
  sh.start()
  t.true(fetch.getCall(0).calledWith('a', 1))
  t.true(fetch.getCall(1).calledWith('b', 2))
})

test('multiple subscriptions', t => {
  const fetch = spy(identity)
  const toObservable = () => fetch
  const sh = new TestScheduler()
  const request = sh.createHotObservable(
    onNext(210, ['a', 1]),
    onNext(220, ['b', 2])
  )
  const store = call(create, toObservable, null, request)
  store.subscribe(identity)
  store.subscribe(identity)
  sh.start()
  t.is(fetch.callCount, 2)
})

test('must get last value', t => {
  const fetch = spy(x => x)
  const toObservable = () => fetch
  const sh = new TestScheduler()
  const request = sh.createHotObservable(
    onNext(100, ['a', 1]),
    onNext(110, ['b', 2])
  )
  sh.startScheduler(() => call(create, toObservable, null, request))
  t.is(fetch.callCount, 1)
  t.true(fetch.calledWith('b', 2))
})
