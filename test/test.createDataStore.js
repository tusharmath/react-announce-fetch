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
    onNext(210, {url: '/a'}),
    onNext(220, {url: '/b'})
  )
  e.create({fetch: x => [x.url]}, request).subscribe(x => out.push(x))
  sh.start()
  t.same(out, ['/a', '/b'])
})
