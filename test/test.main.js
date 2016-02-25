/**
 * Created by tushar.mathur on 24/12/15.
 */

'use strict'
import Rx from 'rx'
import test from 'ava'
import e from '../src/main'
import { TestScheduler, ReactiveTest } from 'rx'
const {onNext, onCompleted} = ReactiveTest

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
    {event: 'WILL_MOUNT'}
  ])
})

test('reload', t => {
  const out = []
  const sh = new TestScheduler()
  const fetches = [
    sh.createHotObservable(
      onNext(230, 'resp-230'),
      onCompleted(231)
    ),
    sh.createHotObservable(
      onNext(240, 'resp-240'),
      onCompleted(241)
    ),
    sh.createHotObservable(
      onNext(250, 'resp-250'),
      onCompleted(251)
    )
  ]
  const fetch = (i) => fetches.shift()
  const request = sh.createHotObservable(
    onNext(210, ['/x'])
  )
  const subject = e(e, fetch, request)

  subject.subscribe(x => out.push(x))
  subject.onNext({event: 'WILL_MOUNT'})
  sh.advanceTo(230)
  e.reload(subject)
  sh.advanceTo(240)
  e.reload(subject)
  sh.advanceTo(250)
  t.same(out, [
    { event: 'WILL_MOUNT' },
    { event: 'FETCH_BEGIN', args: [ '/x' ] },
    { event: 'FETCH_END', args: [ 'resp-230' ] },
    { event: 'FETCH_BEGIN', args: [ '/x' ] },
    { event: 'RELOAD', args: [ ] },
    { event: 'FETCH_END', args: [ 'resp-240' ] },
    { event: 'FETCH_BEGIN', args: [ '/x' ] },
    { event: 'RELOAD', args: [ ] },
    { event: 'FETCH_END', args: [ 'resp-250' ] }
  ])
})
