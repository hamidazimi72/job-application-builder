/* global WebSocket */
jest.dontMock('../src/core/CoreManager');
jest.dontMock('../src/core/CryptoController');
jest.dontMock('../src/core/decode');
jest.dontMock('../src/core/encode');
jest.dontMock('../src/core/EventEmitter');
jest.dontMock('../src/core/LiveQueryClient');
jest.dontMock('../src/core/LocalDatastore');
jest.dontMock('../src/core/ParseObject');
jest.dontMock('../src/core/Storage');
jest.dontMock('../src/core/LocalDatastoreController');
jest.dontMock('../src/core/WebSocketController');
jest.mock(
  'react-native/Libraries/vendor/emitter/EventEmitter',
  () => {
    return {
      default: {
        prototype: {
          addListener: new (require('events').EventEmitter)(),
        },
      },
    };
  },
  { virtual: true }
);

const mockEmitter = require('react-native/Libraries/vendor/emitter/EventEmitter').default;
const CoreManager = require('../src/core/CoreManager');

describe('React Native', () => {
  beforeEach(() => {
    process.env.BAASIRAN_BUILD = 'react-native';
  });

  afterEach(() => {
    process.env.BAASIRAN_BUILD = 'node';
  });

  it('load EventEmitter', () => {
    const eventEmitter = require('../src/core/EventEmitter');
    expect(eventEmitter).toEqual(mockEmitter);
  });

  it('load CryptoController', () => {
    const CryptoJS = require('react-native-crypto-js');
    jest.spyOn(CryptoJS.AES, 'encrypt').mockImplementation(() => {
      return {
        toString: () => 'World',
      };
    });
    const CryptoController = require('../src/core/CryptoController');
    const phrase = CryptoController.encrypt({}, 'salt');
    expect(phrase).toBe('World');
    expect(CryptoJS.AES.encrypt).toHaveBeenCalled();
  });

  it('load LocalDatastoreController', () => {
    const LocalDatastoreController = require('../src/core/LocalDatastoreController');
    require('../src/core/LocalDatastore');
    const LDC = CoreManager.getLocalDatastoreController();
    expect(LocalDatastoreController).toEqual(LDC);
  });

  it('load StorageController', () => {
    const StorageController = require('../src/core/StorageController');
    CoreManager.setStorageController(StorageController);

    jest.spyOn(StorageController, 'setItemAsync');
    const storage = require('../src/core/Storage');
    storage.setItemAsync('key', 'value');
    expect(StorageController.setItemAsync).toHaveBeenCalledTimes(1);
  });

  it('load WebSocketController', () => {
    const WebSocketController = require('../src/core/WebSocketController');
    CoreManager.setWebSocketController(WebSocketController);

    jest.mock('../src/core/EventEmitter', () => {
      return require('events').EventEmitter;
    });
    const socket = WebSocket;
    require('../src/core/LiveQueryClient');
    const websocket = CoreManager.getWebSocketController();
    expect(websocket).toEqual(socket);
  });
});
