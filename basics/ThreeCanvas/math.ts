export const distanceVector = (v1: Position3D, v2: Position3D) => {
  var dx = v1.x - v2.x;
  var dy = v1.y - v2.y;
  var dz = v1.z - v2.z;

  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

export const rotateAroundCenterByRadians = (
  point: Position2D,
  center: Position2D,
  radians: number,
): Position2D => {
  const cos = Math.cos(radians),
    sin = Math.sin(radians),
    nx = cos * (point.x - center.x) + sin * (point.y - center.y) + center.x,
    ny = cos * (point.y - center.y) - sin * (point.x - center.x) + center.y;
  return { x: nx, y: ny };
};

export const movePosition = (
  position: Position3D,
  delta: Position2D,
  globalZRadians: number,
): Position3D => {
  // move left/right/forward/backward
  const deltaPosRotated = rotateAroundCenterByRadians(
    delta,
    { x: 0, y: 0 },
    globalZRadians,
  );

  return {
    ...position,
    x: position.x - deltaPosRotated.x,
    z: position.z - deltaPosRotated.y,
  };
};

export const rotateEndpoint = (
  center: Position3D,
  endpoint: Position3D,
  moveDelta: Position2D,
  // Math.PI / 2
  limit?: number,
) => {
  const offset = {
    x: endpoint.x - center.x,
    y: endpoint.y - center.y,
    z: endpoint.z - center.z,
  };
  const curDistance = distanceVector(endpoint, center);

  // angle from z-axis around y-axis
  let theta =
    Math.atan2(offset.x, offset.z) + (2 * Math.PI * -moveDelta.x) / 1000;
  // angle from y-axis
  let phi =
    Math.atan2(Math.sqrt(offset.x * offset.x + offset.z * offset.z), offset.y) +
    (2 * Math.PI * -moveDelta.y) / 1000;

  // restrict phi to be between desired limits
  if (limit) {
    phi = Math.max(0, Math.min(limit, phi));
  }
  // restrict phi to be betwee EPS and PI-EPS
  phi = Math.max(0.000001, Math.min(Math.PI - 0.000001, phi));

  let radius = curDistance; //offset.length() * 1;

  // append to offset
  offset.x = radius * Math.sin(phi) * Math.sin(theta);
  offset.y = radius * Math.cos(phi);
  offset.z = radius * Math.sin(phi) * Math.cos(theta);

  return {
    x: center.x + offset.x,
    y: center.y + offset.y,
    z: center.z + offset.z,
  };
};
