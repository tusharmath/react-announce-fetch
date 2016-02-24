import test from 'ava'
import e from '../src/fetch'
import { ReactiveTest, TestScheduler } from 'rx'
const {onNext} = ReactiveTest

test(t => {
  const out = []
  const fetch = x => [x]
  const sh = new TestScheduler()
  const com = sh.createHotObservable(
    onNext(210, {event: 'FETCH_START', args: ['req0']}),
    onNext(220, {event: 'FETCH_START', args: ['req1']}),
    onNext(230, {event: 'RELOAD'})
  )
  e(fetch, com).subscribe(x => out.push(x))
  sh.start()
  t.same(out, ['req0', 'req1', 'req1'])
})
