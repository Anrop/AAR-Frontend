import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Map, LayersControl, LayerGroup, TileLayer } from 'react-leaflet'
import { LatLngBounds, TileLayer as LeafletTileLayer } from 'leaflet'
import MiniMap from 'leaflet-minimap'
import { ArmaMarkers } from './ArmaMarkers'
import { ArmaProjectiles } from './ArmaProjectiles'

const { BaseLayer, Overlay } = LayersControl
const tileLayerbounds = new LatLngBounds([-180, -180], [180, 180])
const scaledZoom = 2

export default class ArmaMap extends Component {
  componentDidMount () {
    const { world } = this.props
    const map = this.refs.map.leafletElement
    const offset = Math.pow(2, Math.ceil(Math.log2(world.size.height))) - world.size.height
    const point1 = map.unproject([0, offset], world.size.zoom)
    const point2 = map.unproject([world.size.width, world.size.height + offset], world.size.zoom)
    map.setMaxBounds(new LatLngBounds(point1, point2))

    const tileLayer = new LeafletTileLayer(world.layers[0].url, { bounds: tileLayerbounds });
    new MiniMap(tileLayer, { autoToggleDisplay: true, zoomLevelFixed: 0 }).addTo(map)
  }

  getChildContext () {
    const { world } = this.props

    return {
      world: world
    }
  }

  render () {
    const { children, projectiles, units, vehicles, world } = this.props

    const initialZoom = Math.floor(Math.log2(Math.min(window.innerWidth, window.innerHeight) / 256))

    const tileLayers = world.layers.map((layer, idx) => {
      return (
        <BaseLayer checked key={idx} name={layer.title}>
          <TileLayer
            ref='tileLayer'
            url={layer.url}
            bounds={tileLayerbounds}
            continuousWorld
            noWrap
            minZoom={0}
            maxNativeZoom={world.size.zoom}
            maxZoom={world.size.zoom + scaledZoom}
          />
        </BaseLayer>
      )
    })

    return (
      <Map
        id='map'
        ref='map'
        center={[0, 0]}
        minZoom={0}
        maxZoom={world.size.zoom + scaledZoom}
        zoom={initialZoom}
      >
        <LayersControl position='topright'>
          {tileLayers}

          <Overlay checked name='Projectiles'>
            <LayerGroup key='projectiles'>
              <ArmaProjectiles projectiles={projectiles} />
            </LayerGroup>
          </Overlay>

          <Overlay checked name='Units'>
            <LayerGroup key='units'>
              <ArmaMarkers markers={units} />
            </LayerGroup>
          </Overlay>

          <Overlay checked name='Vehicles'>
            <LayerGroup key='vehicles'>
              <ArmaMarkers markers={vehicles} />
            </LayerGroup>
          </Overlay>
        </LayersControl>

        {children}
      </Map>
    )
  }
};

ArmaMap.childContextTypes = {
  world: PropTypes.object.isRequired
}

ArmaMap.propTypes = {
  projectiles: PropTypes.array.isRequired,
  units: PropTypes.array.isRequired,
  vehicles: PropTypes.array.isRequired,
  world: PropTypes.object.isRequired
}
