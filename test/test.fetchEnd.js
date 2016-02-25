import test from 'ava'
import e from '../src/fetchEnd'
import { ReactiveTest, TestScheduler } from 'rx'
const {onNext} = ReactiveTest

test(t => {
  const sh = new TestScheduler()
  const fetches = [
    sh.createHotObservable(onNext(215, 'res-0')),
    sh.createHotObservable(onNext(225, 'res-1'))
  ]
  const out = []
  const fetch = () => fetches.shift()

  const com = sh.createHotObservable(
    onNext(210, {event: 'FETCH_BEGIN', args: ['/url-0', {opt: 0}]}),
    onNext(220, {event: 'FETCH_BEGIN', args: ['/url-1', {opt: 1}]})
  )
  e(fetch, com).subscribe(x => out.push(x))
  sh.start()
  t.same(out, [
    {event: 'FETCH_END', args: ['res-0']},
    {event: 'FETCH_END', args: ['res-1']}
  ])
})
