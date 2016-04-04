import {isHydrated as f} from '../src/main'
import test from 'ava'
import {ReactiveTest, TestScheduler} from 'rx'
const {onNext} = ReactiveTest

test(t => {
  const out = []
  const sh = new TestScheduler()
  const ev = sh.createHotObservable(
    onNext(210, {event: 'WILL_MOUNT'}),
    onNext(215, {event: 'WILL_MOUNT'}),
    onNext(220, {event: 'DID_MOUNT'}),
    onNext(230, {event: 'WILL_UNMOUNT'})
  )

  f(ev).subscribe(x => out.push(x))
  sh.start()
  t.same(out, [false, true])
})
