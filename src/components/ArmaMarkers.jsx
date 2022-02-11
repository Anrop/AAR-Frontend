import PropTypes from 'prop-types'
import React from 'react'
import { Popup } from 'react-leaflet'
import RotationMarker from './RotationMarker'

export class ArmaMarker extends React.Component {
  render () {
    const { className, markerSize, name, rotation, x, y } = this.props
    const { map, world } = this.context
    const offset = Math.pow(2, Math.ceil(Math.log2(world.size.height))) - world.size.height

    return (
      <RotationMarker
        className={className}
        markerSize={markerSize}
        position={map.unproject([x, y + offset], world.size.zoom)}
        rotation={rotation}
        title={name}
      >
        <Popup>
          <span>{name}</span>
        </Popup>
      </RotationMarker>
    )
  }
}

ArmaMarker.contextTypes = {
  map: PropTypes.object.isRequired,
  world: PropTypes.object.isRequired
}

export class ArmaMarkers extends React.Component {
  render () {
    const { markers } = this.props
    const items = markers.map(({ id, ...props }) => (
      <ArmaMarker key={id} {...props} />
    ))
    return (
      <div style={{ display: 'none' }}>{items}</div>
    )
  }
};
