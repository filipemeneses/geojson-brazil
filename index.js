const request = require('request-promise-native')
const fs = require('fs')
const saveFile = (path, data) => new Promise((resolve, reject) => fs.writeFile(path, data, (err) => err ? reject(err) : resolve()))

const API_STATES_URL = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
const API_STATE_MESH_URL = 'http://servicodados.ibge.gov.br/api/v2/malhas'
const ACCEPT_HEADERS_TYPES = {
  GEO_JSON: 'application/vnd.geo+json',
  TOPO_JSON: 'application/json'
}
const RESOLUTIONS = [
  'none',
  'macroregions',
  'federation_units',
  'mesoregions',
  'microregions',
  'counties'
]

const writeFile = (path, data) => {
  fs.writeFile("/tmp/test", "Hey there!", function(err) {
    if(err) {
      return console.log(err);
    }

    console.log("The file was saved!");
  });
}
const requestResolution = (stateId, resolutionValue) => {
  return request({
    uri: `${API_STATE_MESH_URL}/${stateId}`,
    headers: {
      Accept: ACCEPT_HEADERS_TYPES.GEO_JSON
    },
    qs: {
      resolucao: resolutionValue
    }
  })
}

request.get(API_STATES_URL).then(states => {
  states = JSON.parse(states)
  return Promise.all(states.map(state => {
    return Promise.all(RESOLUTIONS.map((resolution, index) => {
      return requestResolution(state.id, index).then(mesh => {
        saveFile(`meshes/${resolution}/${resolution}-${state.sigla.toLowerCase()}-${state.id}.json`, mesh)
      })
    }))
  }))
})
