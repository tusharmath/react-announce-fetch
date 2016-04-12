/**
 * Created by tushar.mathur on 24/12/15.
 */

'use strict'
import {spy} from 'sinon'
import {TestScheduler, ReactiveTest, Observable} from 'rx'
import test from 'ava'
import {create} from '../src/main'
import {call} from 'funjector'
const {onNext, onCompleted} = ReactiveTest
const identity = x => x

test('fetch:callCount: one per request', t => {
  // Setup
  const fetch = spy(identity)
  const toObservable = () => fetch
  const sh = new TestScheduler()

  const request = sh.createHotObservable(
    onNext(210, ['a', 1]),
    onNext(220, ['b', 2])
  )

  // Begin@200
  const store = call(create, toObservable, request)
  sh.startScheduler(() => store)

  // Assert
  t.is(fetch.callCount, 2)
  t.true(fetch.getCall(0).calledWith('a', 1))
  t.true(fetch.getCall(1).calledWith('b', 2))
})

test('fetch:callCount: multiple-subscription', t => {
  // Setup
  const fetch = spy(x => [x + '-response'])
  const toObservable = () => fetch
  const sh = new TestScheduler()
  const observer0 = sh.createObserver()
  const observer1 = sh.createObserver()
  const request = sh.createHotObservable(
    onNext(210, ['a', 1]),
    onNext(220, ['b', 2])
  )

  const store = call(create, toObservable, request)

  // Begin@200
  sh.scheduleAbsolute(null, 200, () => store.subscribe(observer0))
  sh.scheduleAbsolute(null, 230, () => store.subscribe(observer1))
  sh.start()

  // Assert
  t.is(fetch.callCount, 2)
  t.true(fetch.getCall(0).calledWith('a', 1))
  t.true(fetch.getCall(1).calledWith('b', 2))
  t.deepEqual(observer0.messages, [onNext(210, 'a-response'), onNext(220, 'b-response')])
  t.deepEqual(observer1.messages, [onNext(230, 'b-response')])
})

test('fetch:callCount:as-hot', t => {
  // Setup
  const fetch = spy(x => [x + '-response'])
  const toObservable = () => fetch
  const sh = new TestScheduler()
  const request = sh.createHotObservable(
    onNext(100, ['a0', 0]),
    onNext(110, ['b0', 1])
  )

  // Begin@200
  const store = call(create, toObservable, request)
  const messages = sh.startScheduler(() => store).messages

  // Assert
  t.is(fetch.callCount, 1)
  t.true(fetch.calledWith('b0', 1))
  t.deepEqual(messages, [onNext(200, 'b0-response')])
})

test('cold-request:no-fetch', t => {
  // Setup
  const fetch = spy(x => [x + '-response'])
  const toObservable = () => fetch
  const sh = new TestScheduler()

  // Begin@200
  const store = call(create, toObservable, Observable.just(['a0', 0]))

  // Initial Assert
  t.is(fetch.callCount, 0)
  const messages = sh.startScheduler(() => store).messages

  // Assert
  t.is(fetch.callCount, 1)
  t.true(fetch.getCall(0).calledWith('a0', 0))
  t.deepEqual(messages, [onNext(200, 'a0-response')])
})

test('fetch:reload', t => {
  // Setup
  const fetch = spy(x => [x + '-response'])
  const toObservable = () => fetch
  const sh = new TestScheduler()
  const params = ['a0', 0]
  const request = sh.createHotObservable(
    onNext(200, params),
    onNext(210, params)
  )

  // Begin@200
  const store = call(create, toObservable, request)
  const messages = sh.startScheduler(() => store).messages

  // Assert
  t.is(fetch.callCount, 2)
  t.true(fetch.getCall(0).calledWith('a0', 0))
  t.true(fetch.getCall(1).calledWith('a0', 0))
  t.deepEqual(messages, [onNext(200, 'a0-response'), onNext(210, 'a0-response')])
})
