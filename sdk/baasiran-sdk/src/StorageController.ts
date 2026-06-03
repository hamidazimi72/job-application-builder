import RNStorageController from './StorageController.react-native';
import BrowserStorageController from './StorageController.browser';
import WeappStorageController from './StorageController.weapp';
import DefaultStorageController from './StorageController.default';

let StorageController: any = DefaultStorageController;

if (process.env.BAASIRAN_BUILD === 'react-native') {
  StorageController = RNStorageController;
} else if (process.env.BAASIRAN_BUILD === 'browser') {
  StorageController = BrowserStorageController;
} else if (process.env.BAASIRAN_BUILD === 'weapp') {
  StorageController = WeappStorageController;
}
module.exports = StorageController;
export default StorageController;
