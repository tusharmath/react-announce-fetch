import test from 'ava'
import { fetchBegin as e } from '../src/main'
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

  t.deepEqual(out, [
    {event: 'REQUEST', args: ['req0']},
    {event: 'REQUEST', args: ['req0']}
  ])
})
