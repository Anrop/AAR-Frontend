export default function filterMissions (missions, filter) {
  const name = filter.name.toLowerCase()
  const world = filter.world.toLowerCase()
  return missions.filter((mission) => {
    return mission.length >= filter.length &&
      mission.name.toLowerCase().indexOf(name) >= 0 &&
      mission.world.indexOf(world) >= 0
  })
}
