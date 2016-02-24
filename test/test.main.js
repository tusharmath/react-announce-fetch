/**
 * Created by tushar.mathur on 24/12/15.
 */

'use strict'
import Rx from 'rx'
import test from 'ava'
import e from '../src/main'
import { TestScheduler, ReactiveTest } from 'rx'
const {onNext} = ReactiveTest

test('returns subject', t => {
  const sh = new TestScheduler()
  const d = {
    fetch: () => sh.createHotObservable()
  }
  t.true(e(d) instanceof Rx.Subject)
})

test(t => {
  const out = []
  const sh = new TestScheduler()
  const fetch = (url, options) => sh.createHotObservable(
      onNext(230, url + options.a)
  )
  const request = sh.createHotObservable(
    onNext(210, ['/a', {a: 0}])
  )
  const subject = e(e, fetch, request)

  subject.subscribe(x => out.push(x))
  subject.onNext({event: 'WILL_MOUNT'})

  sh.start()
  subject.onNext({event: 'WILL_MOUNT'})
  t.same(out, [
    {event: 'WILL_MOUNT'},
    {event: 'FETCH_BEGIN', args: ['/a', {a: 0}]},
    {event: 'FETCH_END', args: ['/a0']},
    {event: 'WILL_MOUNT' }
  ])
})
