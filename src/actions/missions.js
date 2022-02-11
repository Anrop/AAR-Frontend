import fetch from 'isomorphic-fetch'
import apiEndpoint from '../data/aar'

export const INVALIDATE_MISSIONS = 'INVALIDATE_MISSIONS'
export const REQUEST_MISSIONS = 'REQUEST_MISSIONS'
export const RECEIVE_MISSIONS = 'RECEIVE_MISSIONS'
export const SET_MISSIONS_FILTER = 'SET_MISSIONS_FILTER'
export const SET_MISSIONS_PAGE = 'SET_MISSIONS_PAGE'

export function invalidateMissions () {
  return {
    type: INVALIDATE_MISSIONS
  }
}

function requestMissions () {
  return {
    type: REQUEST_MISSIONS
  }
}

function receiveMissions (missions) {
  const missionsById = {}
  missions.forEach(function (mission) {
    mission.world = mission.world.toLowerCase()
    missionsById[mission.id] = mission
  })

  return {
    type: RECEIVE_MISSIONS,
    missions: missions,
    missionsById: missionsById,
    receivedAt: Date.now()
  }
}

function fetchMissions () {
  return dispatch => {
    dispatch(requestMissions())
    return fetch(apiEndpoint + '/missions')
      .then(req => req.json())
      .then(json => dispatch(receiveMissions(json)))
  }
}

function shouldFetchMissions (state) {
  const missions = state.missions
  if (!missions || !missions.missionsById) {
    return true
  } else if (missions.isFetching) {
    return false
  } else {
    return missions.didInvalidate
  }
}

export function fetchMissionsIfNeeded () {
  return (dispatch, getState) => {
    if (shouldFetchMissions(getState())) {
      return dispatch(fetchMissions())
    }
  }
}

export function setMissionsFilter (filter) {
  return {
    type: SET_MISSIONS_FILTER,
    filter: filter
  }
}

export function setMissionsPage (page) {
  return {
    type: SET_MISSIONS_PAGE,
    page: page
  }
}
