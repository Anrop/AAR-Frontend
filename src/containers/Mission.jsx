import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Grid } from 'react-bootstrap'
import Control from 'react-leaflet-control'
import { connect } from 'react-redux'
import ArmaMap from '../components/ArmaMap'
import TimeControl from '../components/TimeControl'
import EventsTicker from '../components/EventsTicker'
import { loadEvents, seekEvents, stopEvents } from '../actions/events'
import { fetchMissionsIfNeeded } from '../actions/missions'

class Mission extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isPlaying: true,
      speed: 10
    }
  }

  componentDidMount () {
    const { dispatch, mission, world } = this.props

    if (mission && world) {
      dispatch(loadEvents(mission, world))
    }

    dispatch(fetchMissionsIfNeeded())
  }

  componentWillUnmount () {
    const { dispatch } = this.props
    dispatch(stopEvents())
  }

  componentDidUpdate (prevProps) {
    const { dispatch, mission, world } = this.props
    if (this.props.mission !== prevProps.mission) {
      dispatch(loadEvents(mission, world))
    }
  }

  render () {
    const { mission, projectiles, units, vehicles, isFetching, time, world } = this.props
    const { isPlaying, speed } = this.state

    return (
      <div id='map-container'>
        {mission && !world &&
          <Grid>
            <h2>World {mission.world} is not configured</h2>
          </Grid>}
        {world && isFetching &&
          <Grid>
            <h2>Loading...</h2>
          </Grid>}
        {world && !isFetching && (projectiles.length + units.length + vehicles.length) === 0 &&
          <Grid>
            <h2>No events</h2>
          </Grid>}
        {world && time &&
          <div className='flex'>
            <ArmaMap
              projectiles={projectiles}
              units={units}
              vehicles={vehicles}
              world={world}
            >
              <Control className='leaflet-bar leaflet-control-slider' position='bottomleft'>
                <TimeControl
                  isPlaying={isPlaying}
                  mission={mission}
                  seek={this.seek.bind(this)}
                  setSpeed={this.setSpeed.bind(this)}
                  speed={speed}
                  time={time}
                  togglePlaying={this.togglePlaying.bind(this)}
                />
              </Control>
            </ArmaMap>
            <EventsTicker
              isPlaying={isPlaying}
              speed={speed}
            />
          </div>}
      </div>
    )
  }

  setSpeed (speed) {
    this.setState({ speed: speed })
  }

  togglePlaying () {
    const { isPlaying } = this.state
    this.setState({ isPlaying: !isPlaying })
  }

  seek (event) {
    const { time } = this.props
    const newCurrentTime = Math.min(parseInt(event.target.value, 10), time.end)
    seekEvents(newCurrentTime)
  }
}

Mission.propTypes = {
  projectiles: PropTypes.array.isRequired,
  units: PropTypes.array.isRequired,
  vehicles: PropTypes.array.isRequired,
  time: PropTypes.object,
  world: PropTypes.object,
  isFetching: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps (state, ownProps) {
  const { events, missions, worlds } = state
  const {
    isFetching,
    projectiles,
    units,
    vehicles,
    time
  } = events || {
    isFetching: true,
    projectiles: [],
    units: [],
    vehicles: [],
    time: null
  }
  const {
    worldsByName
  } = worlds || {
    worldsByName: {}
  }

  const id = ownProps.match.params.id
  let mission = null
  let world = null
  if (missions.missionsById && missions.missionsById[id]) {
    mission = missions.missionsById[id]
    world = worldsByName[mission.world]
  }

  return {
    isFetching,
    mission,
    projectiles,
    units,
    vehicles,
    time,
    world
  }
}

export default connect(mapStateToProps)(Mission)
