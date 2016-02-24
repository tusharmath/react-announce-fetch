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
  const fetch = x => [x]
  const request = sh.createHotObservable(
    onNext(210, {url: '/a'})
  )
  const subject = e(e, fetch, request)
  subject.subscribe(x => out.push(x))
  sh.start()
  subject.onNext({event: 'WILL_MOUNT'})  
})
