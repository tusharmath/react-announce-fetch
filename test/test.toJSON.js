/**
 * Created by tushar.mathur on 12/04/16.
 */

'use strict'
import {spy} from 'sinon'
import {TestScheduler, ReactiveTest} from 'rx'
import test from 'ava'
import toJSON from '../src/toJSON'

const {onNext} = ReactiveTest
const createResponse = val => ({
  status: 200,
  json: spy(() => [val + '-json'])
})

test(t => {
  const sh = new TestScheduler()
  const mocks = [0, 1, 2].map(createResponse)
  const responses = sh.createHotObservable(
    onNext(210, mocks[0]),
    onNext(220, mocks[1]),
    onNext(230, mocks[2])
  )
  const {messages} = sh.startScheduler(() => toJSON(responses))

  t.deepEqual(messages, [
    onNext(210, {json: '0-json', response: mocks[0]}),
    onNext(220, {json: '1-json', response: mocks[1]}),
    onNext(230, {json: '2-json', response: mocks[2]})
  ])
})

test('json():callCount', t => {
  const sh = new TestScheduler()
  const mockResponse = createResponse(0)
  const ob0 = sh.createObserver()
  const ob1 = sh.createObserver()
  const responses = sh.createHotObservable(onNext(210, mockResponse))
  const json = toJSON(responses)
  sh.scheduleAbsolute(null, 200, () => json.subscribe(ob0))
  sh.scheduleAbsolute(null, 205, () => json.subscribe(ob1))
  sh.start()
  t.is(mockResponse.json.callCount, 1)
})
