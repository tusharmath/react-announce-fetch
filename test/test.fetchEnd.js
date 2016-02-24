import test from 'ava'
import e from '../src/fetchEnd'
import { ReactiveTest, TestScheduler } from 'rx'
const {onNext} = ReactiveTest

test(t => {
  const out = []
  const fetch = (url, options) => [url + options.opt]
  const sh = new TestScheduler()
  const com = sh.createHotObservable(
    onNext(210, {event: 'FETCH_BEGIN', args: ['/url-0', {opt: 0}]}),
    onNext(220, {event: 'FETCH_BEGIN', args: ['/url-1', {opt: 1}]}),
    onNext(230, {event: 'RELOAD'})
  )
  e(fetch, com).subscribe(x => out.push(x))
  sh.start()
  t.same(out, [
    {event: 'FETCH_END', args: ['/url-00']},
    {event: 'FETCH_END', args: ['/url-11']},
    {event: 'FETCH_END', args: ['/url-11']}
  ])
})
