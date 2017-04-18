import test from 'ava'
import { getHydratedRequests as e } from '../src/main'
import { ReactiveTest, TestScheduler } from 'rx'
const {onNext} = ReactiveTest

test(t => {
  const out = []
  const sh = new TestScheduler()
  const req = sh.createHotObservable(
    onNext(210, 'req0'),
    onNext(220, 'req1')
  )
  const com = sh.createHotObservable(
    onNext(215, {event: 'WILL_MOUNT', args: []})
  )
  e(req, com).subscribe(x => out.push(x))
  sh.start()
  t.deepEqual(out, ['req0', 'req1'])
})