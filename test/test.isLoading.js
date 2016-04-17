import f from '../src/isLoading'
import test from 'ava'
import { ReactiveTest, TestScheduler } from 'rx'
const {onNext} = ReactiveTest

test(t => {
  const out = []
  const sh = new TestScheduler()
  const ev0 = sh.createHotObservable(
    onNext(210, {event: 'REQUEST'}),
    onNext(220, {event: 'RESPONSE'})
  )
  f(ev0).subscribe(x => out.push(x))
  sh.start()
  t.deepEqual(out, [true, false])
})

test('multiple:overlapping', t => {
  const out = []
  const sh = new TestScheduler()
  const ev0 = sh.createHotObservable(
    onNext(210, {event: 'REQUEST'}),
    onNext(220, {event: 'RESPONSE'})
  )
  const ev1 = sh.createHotObservable(
    onNext(215, {event: 'REQUEST'}),
    onNext(225, {event: 'RESPONSE'})
  )
  f(ev0, ev1).subscribe(x => out.push(x))
  sh.start()
  t.deepEqual(out, [true, false])
})

test('multiple:exclusive', t => {
  const out = []
  const sh = new TestScheduler()
  const ev0 = sh.createHotObservable(
    onNext(210, {event: 'REQUEST'}),
    onNext(220, {event: 'RESPONSE'})
  )
  const ev1 = sh.createHotObservable(
    onNext(225, {event: 'REQUEST'}),
    onNext(235, {event: 'RESPONSE'})
  )
  f(ev0, ev1).subscribe(x => out.push(x))
  sh.start()
  t.deepEqual(out, [true, false, true, false])
})
