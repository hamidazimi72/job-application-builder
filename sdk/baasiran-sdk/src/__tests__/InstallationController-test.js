jest.dontMock('../src/core/CoreManager');
jest.dontMock('../src/core/decode');
jest.dontMock('../src/core/encode');
jest.dontMock('../src/core/InstallationController');
jest.dontMock('../src/core/ObjectStateMutations');
jest.dontMock('../src/core/ParseInstallation');
jest.dontMock('../src/core/ParseObject');
jest.dontMock('../src/core/ParseOp');
jest.dontMock('../src/core/Storage');
jest.dontMock('../src/core/StorageController.default');
jest.dontMock('../src/core/SingleInstanceStateController');
jest.dontMock('../src/core/UniqueInstanceStateController');
jest.mock('../src/core/uuid', () => {
  let value = 0;
  return () => value++ + '';
});

const CoreManager = require('../src/core/CoreManager');
const ParseInstallation = require('../src/core/ParseInstallation');
const InstallationController = require('../src/core/InstallationController');
const Storage = require('../src/core/Storage');

CoreManager.setStorageController(require('../src/core/StorageController.default'));

describe('InstallationController', () => {
  beforeEach(() => {
    CoreManager.set('APPLICATION_ID', 'A');
    CoreManager.set('JAVASCRIPT_KEY', 'B');
    Storage._clear();
    InstallationController._clearCache();
  });

  it('generates a new installation id when there is none', async () => {
    const iid = await InstallationController.currentInstallationId();
    expect(typeof iid).toBe('string');
    expect(iid.length).toBeGreaterThan(0);
  });

  it('caches the installation id', async () => {
    const iid = await InstallationController.currentInstallationId();
    Storage._clear();
    const i = await InstallationController.currentInstallationId();
    expect(i).toBe(iid);
  });

  it('permanently stores the installation id', async () => {
    const iid = await InstallationController.currentInstallationId();
    InstallationController._clearCache();
    const i = await InstallationController.currentInstallationId();
    expect(i).toBe(iid);
  });

  it('can set installation id', async () => {
    const iid = '12345678';
    InstallationController._setInstallationIdCache(iid);
    const i = await InstallationController.currentInstallationId();
    expect(i).toBe(iid);
  });

  it('generates a new installation when there is none', async () => {
    const installation = await InstallationController.currentInstallation();
    expect(installation instanceof ParseInstallation).toBe(true);
    expect(installation.deviceType).toBe('web');
    expect(installation.installationId).toBeDefined();
  });

  it('caches the current installation', async () => {
    const iid = 'cached-installation-id';
    InstallationController._setInstallationIdCache(iid);
    const installation = await InstallationController.currentInstallation();
    Storage._clear();
    const i = await InstallationController.currentInstallation();
    expect(i.installationId).toEqual(installation.installationId);
  });

  it('permanently stores the current installation', async () => {
    const iid = 'stored-installation-id';
    InstallationController._setInstallationIdCache(iid);
    const installation = await InstallationController.currentInstallation();
    InstallationController._clearCache();
    const i = await InstallationController.currentInstallation();
    expect(i.installationId).toEqual(installation.installationId);
  });

  it('can update installation on disk', async () => {
    const installationId = 'new-installation-id';
    const installation = new ParseInstallation({ installationId });
    InstallationController.updateInstallationOnDisk(installation);
    const i = await InstallationController.currentInstallation();
    expect(i.installationId).toBe(installationId);
  });

  it('can handle cache not matching disk', async () => {
    InstallationController._setCurrentInstallationCache(null, true);
    const i = await InstallationController.currentInstallation();
    expect(i).toBeNull();
  });
});
