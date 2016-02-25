import test from 'ava'
import e from '../src/fetchBegin'
import { ReactiveTest, TestScheduler } from 'rx'
const {onNext} = ReactiveTest

test(t => {
  const out = []
  const sh = new TestScheduler()
  const obs = sh.createHotObservable(
    onNext(210, {event: 'WILL_MOUNT', args: []}),
    onNext(230, {event: 'RELOAD'})
  )
  const req = sh.createHotObservable(
    onNext(220, ['req0'])
  )
  e(req, obs).subscribe(x => out.push(x))
  sh.start()

  t.same(out, [
    {event: 'FETCH_BEGIN', args: ['req0']},
    {event: 'FETCH_BEGIN', args: ['req0']}
  ])
})
