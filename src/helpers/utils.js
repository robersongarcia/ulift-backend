//get distance between two points with lat and lng using pitagoras in meters
const getDistance = (point1, point2) => {
    const R = 6371e3; // meters
    const φ1 = point1.lat * Math.PI/180; // φ, λ in radians
    const φ2 = point2.lat * Math.PI/180;
    const Δφ = (point2.lat-point1.lat) * Math.PI/180;
    const Δλ = (point2.lng-point1.lng) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const d = R * c; // in meters
    return d;
}

module.exports = {
    getDistance
}