import Parse from './Parse';
import BaasiranUtils from './BaasiranUtils';
import CoreManager from './CoreManager';
import BaasiranInstallation from './BaasiranInstallation';
import BaasiranMessaging from './BaasiranMessaging';
import BaasiranAnalytics from './BaasiranAnalytics';
import BaasiranAuth from './BaasiranAuth';

class BaasiranCore {

  private static instance: BaasiranCore;
  private static baasiranInstallation: BaasiranInstallation;
  static baasiranMessaging: BaasiranMessaging;
  static baasiranAnalytics: BaasiranAnalytics;
  static baasiranAuth: BaasiranAuth;

  private constructor() {

  }

  private static async preInit(appIdentifier: string, clientKey: string, developerKey: string): Promise<void> {
    if(!appIdentifier || !clientKey || !developerKey) {
      throw new Error('unauthorized');
    }

    const localAppIdentifier: string = localStorage.getItem("appIdentifier");
    const localClientKey: string = localStorage.getItem("clientKey");
    const localDeveloperKey: string = localStorage.getItem("developerKey");
    const isMobile: string = localStorage.getItem("isMobile");
    if ((localAppIdentifier && localAppIdentifier !== appIdentifier) ||
        (localClientKey && localClientKey !== clientKey) ||
        (localDeveloperKey && localDeveloperKey !== developerKey) ||
        (!isMobile)) {
      localStorage.clear();
    }
  }

  private static async init(serverURL: string, projectId: string, appIdentifier: string, clientKey: string, developerKey: string): Promise<void> {

    await this.preInit(appIdentifier, clientKey, developerKey);
    const authKey: string = `${clientKey},${developerKey}`;
    const isMobile: string = BaasiranUtils.mobileAndTabletCheck().toString();
    Parse._initialize(projectId, authKey);
    Parse.serverURL = serverURL;
    Parse.Storage.setItem("appIdentifier", appIdentifier);
    Parse.Storage.setItem("clientKey", clientKey);
    Parse.Storage.setItem("developerKey", developerKey);
    Parse.Storage.setItem("isMobile", isMobile);
    CoreManager.set("REQUEST_HEADERS", {"appIdentifier": appIdentifier, "clientKey": clientKey, "developerKey": developerKey, "isMobile": isMobile, "sdk": "web"});
    this.baasiranInstallation = await BaasiranInstallation.getInstance();
    if (!Parse.Storage.getItem("lastSeen")){
      Parse.Storage.setItem("lastSeen", BaasiranUtils.getTime().toString());
    }
  }

  static async getInstance(serverURL: string, projectId: string, appIdentifier: string, clientKey: string, developerKey: string): Promise<BaasiranCore> {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new BaasiranCore();
    await this.init(serverURL, projectId, appIdentifier, clientKey, developerKey);
    return this.instance;
  }

}

module.exports = BaasiranCore;
export default BaasiranCore;


