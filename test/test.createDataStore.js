/**
 * Created by tushar.mathur on 24/12/15.
 */

'use strict'
import Rx from 'rx'
import test from 'ava'
import e from '../src/createDataStore'
import { ReactiveTest, TestScheduler } from 'rx'
const {onNext, onCompleted} = ReactiveTest

test('returns subject', t => {
  const sh = new TestScheduler()
  t.true(e.create({}, sh.createHotObservable()) instanceof Rx.Subject)
})

test('fetch', t => {
  const out = []
  const sh = new TestScheduler()
  const request = sh.createHotObservable(
    onNext(210, {}),
    onNext(220, {})
  )
  const hydration = sh.createHotObservable()
  e.create({fetch: x => [x.url]}, request, hydration).subscribe(x => out.push(x))
  sh.start()
  t.same(out, [])
})

test('fetch:hydration:1', t => {
  const out = []
  const sh = new TestScheduler()
  const request = sh.createHotObservable(
    onNext(210, {url: '/a'}),
    onNext(220, {url: '/b'})
  )
  const hydration = sh.createHotObservable(
    onNext(201, true)
  )
  e.create({fetch: x => [x.url]}, request, hydration).subscribe(x => out.push(x))
  sh.start()
  t.same(out, [
    {event: 'FETCH_START', args: [{url: '/a'}]},
    {event: 'FETCH_END', args: ['/a']},
    {event: 'FETCH_START', args: [{url: '/b'}]},
    {event: 'FETCH_END', args: ['/b']}
  ])
})
