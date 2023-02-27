import alertsHandlers from './alerts';
import cameraHandlers from './cameras';
import photoHandlers from './photos';

const handlers = [...alertsHandlers, ...cameraHandlers, ...photoHandlers];

export default handlers;
