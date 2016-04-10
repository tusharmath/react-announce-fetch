'use strict'

module.exports = store => store.flatmap(
  response => response.json().then(json => ({json, response}))
)
