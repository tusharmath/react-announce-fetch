/**
 * Created by tushar.mathur on 24/12/15.
 */
'use strict'

const create = require('./src/main').create

/**
 * Takes in `request` parameters that will be used to call the {@link external:fetch} function.
 * The request params is essentially the arguments to the {@link external:fetch} function — `[url, options]`.
 * Internally the request observable is used as follows:
 * ```js
 * request.flatMap(params => fetch.apply(null, params))
 * ```
 * ##### Performance:
 * Though you can simply use the code above this module a couple of extra things to optimize interms of making HTTP requests.
 *
 * 1. API requests are only made once per notification on the request stream, irrespective of how many subscribers have subscribed to it.
 * Once a response is received it is shared by all its subscribers.
 *
 * 2. No API requests must be made until there is at least one subscriber on the response stream.
 * Once there is a subscriber only one request should be made with the latest value on the request stream.
 *
 * 3. In case a subscriber disposes and resubscribes later in time, it should get the most recent response.
 * 
 * @param {external:Observable} request - Request stream that emits params for the {@link external:fetch} function as an array.
 * @param {function} [fetch=window.fetch.bind(window)] - Optional custom fetch method
 * @return {external:Observable} Emits the Response Object that returned by {@link external:fetch}
 */
exports.create = (request, fetch) => create(
  request,
  fetch || window.fetch.bind(window)
)

/**
 * Create a {@link external:Response} stream where the {@link https://developer.mozilla.org/en-US/docs/Web/API/Body/json json()} method is already called upon.
 * It makes sure that json parsing is only done once and the result is shared amongst everyone.
 * @function
 * @param {external:Observable} response - Response stream that is returned by {@link create}
 * @return {external:Observable} Maps {@link external:Response} to a JS object containing `json` and the original `response`.
 */
exports.toJSON = require('./src/toJSON')

/**
 * An observable is an interface that provides a generalized mechanism for push-based notification,
 * also known as observer design pattern.
 * @external Observable
 * @see {@link https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md RxJS Observable}
 */

/**
 * Represents the response to a request in the {@link external:fetch} API.
 * @external Response
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Response Response}
 */

/**
 * `window.fetch` is an easier way to make web requests and handle responses than using `XMLHttpRequest`.
 * It returns a promise and is easily consumed by {@link https://github.com/Reactive-Extensions/RxJS Rx}
 * using the {@link https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/selectmany.md flatMap} operator.
 * @external fetch
 * @see {@link https://github.com/github/fetch fetch polyfill}
 */
