import BaasiranMessaging from './BaasiranMessaging';
import BaasiranCore from './BaasiranCore';
import BaasiranAnalytics from './BaasiranAnalytics';
import BaasiranAuth from './BaasiranAuth';

/**
 * Contains all Baasiran API classes and functions.
 */

interface BaasiranConfigType {
  serverURL: string;
  projectId: string;
  appIdentifier: string;
  clientKey: string;
  developerKey: string;
}

interface BaasiranType {
  Baasiran?: BaasiranType;
  initializeApp(Keys: BaasiranConfigType): Promise<void>;
  getMessaging(): Promise<BaasiranMessaging>;
  getAnalytics(): Promise<void>;
  getAuth(): Promise<BaasiranAuth>;
}

const Baasiran: BaasiranType = {
  async initializeApp(Keys: BaasiranConfigType): Promise<void> {
    try {
      await BaasiranCore.getInstance(Keys.serverURL, Keys.projectId, Keys.appIdentifier, Keys.clientKey, Keys.developerKey);
    } catch (error) {
      throw new Error(error.toString()
        .replaceAll("Parse","Baasiran")
        .replaceAll("parse","baasiran"));
    }
  },
  async getMessaging(): Promise<BaasiranMessaging> {
    try {
      const baasiranMessaging: BaasiranMessaging = await BaasiranMessaging.getInstance();
      BaasiranCore.baasiranMessaging = baasiranMessaging;
      return baasiranMessaging;
    } catch (error) {
      throw new Error(error.toString()
        .replaceAll("Parse","Baasiran")
        .replaceAll("parse","baasiran"));
    }
  },
  async getAnalytics(): Promise<void> {
    try {
      BaasiranCore.baasiranAnalytics = await BaasiranAnalytics.getInstance();
    } catch (error) {
      throw new Error(error.toString()
        .replaceAll("Parse","Baasiran")
        .replaceAll("parse","baasiran"));
    }
  },
  async getAuth(): Promise<BaasiranAuth> {
    try {
      const baasiranAuth: BaasiranAuth = await BaasiranAuth.getInstance();
      BaasiranCore.baasiranAuth = baasiranAuth;
      return baasiranAuth;
    } catch (error) {
      throw new Error(error.toString()
        .replaceAll("Parse","Baasiran")
        .replaceAll("parse","baasiran"));
    }
  }
};


// For legacy requires, of the form `var Baasiran = require('baasiran').Baasiran`
Baasiran.Baasiran = Baasiran;
module.exports = Baasiran;
export default Baasiran;
