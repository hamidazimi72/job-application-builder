/* global WebSocket */
import ws from 'ws';
import SocketWeapp from './Socket.weapp';

let WebSocketController;

try {
  if (process.env.BAASIRAN_BUILD === 'browser') {
    WebSocketController =
      typeof WebSocket === 'function' || typeof WebSocket === 'object' ? WebSocket : null;
  } else if (process.env.BAASIRAN_BUILD === 'node') {
    WebSocketController = ws;
  } else if (process.env.BAASIRAN_BUILD === 'weapp') {
    WebSocketController = SocketWeapp;
  } else if (process.env.BAASIRAN_BUILD === 'react-native') {
    WebSocketController = WebSocket;
  }
} catch (_) {
  // WebSocket unavailable
}
module.exports = WebSocketController;
export default WebSocketController;
