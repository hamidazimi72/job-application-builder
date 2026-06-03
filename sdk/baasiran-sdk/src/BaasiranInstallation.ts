import Parse from './Parse';
import CoreManager from './CoreManager';
import BaasiranUtils from './BaasiranUtils';

class BaasiranInstallation {

  private static instance: BaasiranInstallation;

  private constructor() {

  }

  private static async saveInstallationData(appIdentifier: string): Promise<void> {
    const installationId: string = await Parse._getInstallationId();
    const isMobile: boolean = BaasiranUtils.mobileAndTabletCheck();
    const WebInstallationData = Parse.Object.extend("WebInstallationData");
    const query = new Parse.Query(WebInstallationData);
    query.equalTo("installationId", installationId);
    const widObject = await query.first();
    if (!widObject) {
      const webInstallationData = new WebInstallationData();
      webInstallationData.set("appIdentifier", appIdentifier);
      webInstallationData.set("installationId", installationId);
      webInstallationData.set("isMobile", isMobile)
      await webInstallationData.save();
    }
  }

  private static async init(): Promise<void> {
    const authKeys = CoreManager.get("REQUEST_HEADERS");
    if(!authKeys.appIdentifier || !authKeys.clientKey || !authKeys.developerKey) {
      throw new Error('unauthorized');
    }
    await this.saveInstallationData(authKeys.appIdentifier);
  }

  static async getInstance(): Promise<BaasiranInstallation> {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new BaasiranInstallation();
    await this.init();
    return this.instance;
  }

}

module.exports = BaasiranInstallation;
export default BaasiranInstallation;


