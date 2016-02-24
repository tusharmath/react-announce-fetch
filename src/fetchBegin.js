const getHydratedRequests = require('./getHydratedRequests')
module.exports = (request, observer) => getHydratedRequests(request, observer)
    .map(x => ({event: 'FETCH_END', args: [x]}))
