export const getBoundaryBox = (midPoint, zoomLevel) => {
    const rangeFactor = (1 / zoomLevel) * RANGE_BASE_POINT;
    const left = midPoint[0] - rangeFactor; //minLongX
    const right = midPoint[0] + rangeFactor; //maxLongX
    const top = midPoint[1] + rangeFactor; //maxLatY
    const bottom = midPoint[1] - rangeFactor; //minLatY
    return [left, bottom, right, top];
}