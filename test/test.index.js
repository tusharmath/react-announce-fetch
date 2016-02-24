/**
 * Created by tushar.mathur on 24/12/15.
 */

'use strict'
import Rx from 'rx'
import test from 'ava'
import e from '../src'
import { ReactiveTest, TestScheduler } from 'rx'
const {onNext, onCompleted} = ReactiveTest
const noop = function () {}
test('returns subject', t => {
  const sh = new TestScheduler()
  const d = {
    isHydrated: noop,
    getHydratedRequests: noop,
    fetchStart: () => sh.createHotObservable(),
    fetch: () => sh.createHotObservable()
  }
  t.true(e(d) instanceof Rx.Subject)
})
