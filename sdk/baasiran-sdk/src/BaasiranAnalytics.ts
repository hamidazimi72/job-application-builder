import Parse from './Parse';
import BaasiranUtils from './BaasiranUtils';

class BaasiranAnalytics {

  private static instance: BaasiranAnalytics;
  private constructor() {

  }

  private static async updateInstallationData(): Promise<void> {

    const installationId: string = await Parse._getInstallationId();
    const appIdentifier: string = Parse.Storage.getItem("appIdentifier");
    const WebInstallationData = Parse.Object.extend("WebInstallationData");
    const query = new Parse.Query(WebInstallationData);
    query.equalTo("installationId", installationId);
    query.equalTo("appIdentifier", appIdentifier);
    const widObject = await query.first();
    if (widObject) {
      const browserDetail: object = BaasiranUtils.getBrowserDetail();
      widObject.set("browserName", browserDetail["name"]);
      widObject.set("browserVersion", browserDetail["version"]);
      // @ts-ignore
      await widObject.save();
    }
  }

  async sendNotificationReport(notificationId:string, notification: Notification): Promise<void> {

    const installationId: string = await Parse._getInstallationId();

    notification.onclick = async function(): Promise<void> {
      const params =  { mid: notificationId, mact: "opened", installationId: installationId};
      await Parse.Cloud.run("wb_ntf_re", params, {});
    }

    notification.onclose = async function(): Promise<void> {
      const params =  { mid: notificationId, mact: "dismissed", installationId: installationId};
      await Parse.Cloud.run("wb_ntf_re", params, {});
    }

    notification.onerror = async function(): Promise<void> {
      const params =  { mid: notificationId, mact: "received", installationId: installationId};
      await Parse.Cloud.run("wb_ntf_re", params, {});
    }
  }

  private static async init(): Promise<void> {
    await this.updateInstallationData();
  }

  async getToken(): Promise<string> {
    return await Parse._getInstallationId();
  }

  static async getInstance(): Promise<BaasiranAnalytics> {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new BaasiranAnalytics();
    await this.init();
    return this.instance;
  }

}

module.exports = BaasiranAnalytics;
export default BaasiranAnalytics;


