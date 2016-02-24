const getHydratedRequests = require('./getHydratedRequests')
module.exports = (req, obs) => getHydratedRequests(req, obs)
    .map(x => ({event: 'FETCH_BEGIN', args: [x]}))
