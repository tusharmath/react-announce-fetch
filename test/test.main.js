/**
 * Created by tushar.mathur on 24/12/15.
 */

'use strict'
import Rx from 'rx'
import test from 'ava'
import e from '../src/main'
import { ReactiveTest, TestScheduler } from 'rx'
const {onNext} = ReactiveTest
const noop = function () {}
test('returns subject', t => {
  const sh = new TestScheduler()
  const d = {
    isHydrated: noop,
    getHydratedRequests: noop,
    fetchStart: () => sh.createHotObservable(),
    fetchEnd: () => sh.createHotObservable()
  }
  t.true(e(d) instanceof Rx.Subject)
})
