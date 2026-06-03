import Parse from './Parse';
import BaasiranUtils from './BaasiranUtils';
import BaasiranCore from './BaasiranCore';
import baasiranUtils from './BaasiranUtils';

class BaasiranMessaging {

  private static instance: BaasiranMessaging;

  private constructor() {
    if (!BaasiranUtils.checkNotificationSupport()) {
      throw new Error('This browser does not support Notification!');
    }
    if (BaasiranUtils.mobileAndTabletCheck()) {
      if(!BaasiranUtils.checkServiceWorkerSupport()) {
        throw new Error('This browser does not support Service Worker!');
      } else if(!BaasiranUtils.checkPushManagerSupport()) {
        throw new Error('This browser does not support Push API!');
      }
    }
  }

  private static async preInit(): Promise<void> {
    if(BaasiranUtils.mobileAndTabletCheck()) {
      const swRegistration: ServiceWorkerRegistration = await this.registerServiceWorker();
      if (swRegistration) {
        swRegistration.addEventListener("updatefound", () => {
          console.log("Service Worker update found!");
          swRegistration.update();
        });
      }
    }
    return;
  }

  private static async registerServiceWorker(): Promise<ServiceWorkerRegistration> {
    return await navigator.serviceWorker.register('./baasiran-messaging-sw.js');
  }

  private static updateLastSeen(timestamp: number): void {
    Parse.Storage.setItem('lastSeen', timestamp.toString());
  }

  private static async getRecentNotifications(): Promise<void> {
    const lastSeen: string = Parse.Storage.getItem("lastSeen");
    const appIdentifier: string = Parse.Storage.getItem("appIdentifier");
    if (lastSeen && appIdentifier) {
      const WebPush = Parse.Object.extend("WebPush");
      const query = new Parse.Query(WebPush);
      query.equalTo("appIdentifier", appIdentifier);
      query.contains("installationId", await Parse._getInstallationId());
      query.greaterThan("timestamp", parseInt(lastSeen));
      query.select("payload");
      query.select("timestamp");
      const results = await query.find();
      let timestamp: number = baasiranUtils.getTime();
      for (const result of results) {
        const payload = result.get("payload")
        if(BaasiranUtils.mobileAndTabletCheck()) {
          const swRegistration: ServiceWorkerRegistration = await navigator.serviceWorker.getRegistration();
          await BaasiranUtils.showMobileNotification(payload, swRegistration);
        } else {
          const notification:Notification = BaasiranUtils.showLocalNotification(payload);
          if(BaasiranCore.baasiranAnalytics)
            await BaasiranCore.baasiranAnalytics.sendNotificationReport(result.id, notification);
        }
        timestamp = result.get("timestamp");
      }
      this.updateLastSeen(timestamp);
    }
  }

  private static async init(): Promise<void> {
    await this.preInit();
    const permission = await BaasiranUtils.requestNotificationPermission();
    if (permission !== 'granted')
      console.log('Permission not granted for Notification!');

    const appIdentifier: string = Parse.Storage.getItem("appIdentifier");

    const query = new Parse.Query('WebPush');
    query.equalTo("appIdentifier", appIdentifier);
    query.select("payload");
    query.select("timestamp");
    query.contains("installationId", await Parse._getInstallationId());
    const subscription = await query.subscribe();

    subscription.on('open', () => {
      console.log('subscription opened');
      this.getRecentNotifications();
    });

    subscription.on('create', async (data: any): Promise<void> => {
      console.log(data.get('payload'));
      const payload = data.get('payload');
      if(BaasiranUtils.mobileAndTabletCheck()) {
        const swRegistration: ServiceWorkerRegistration = await navigator.serviceWorker.getRegistration();
        await BaasiranUtils.showMobileNotification(payload, swRegistration);
      } else {
        const notification:Notification = BaasiranUtils.showLocalNotification(payload);
        if(BaasiranCore.baasiranAnalytics)
          await BaasiranCore.baasiranAnalytics.sendNotificationReport(data.id, notification);
      }
      this.updateLastSeen(data.get("timestamp"));
    });

    subscription.on('close', () => {
      console.log('subscription closed');
    });
  }

  async getToken(): Promise<string> {
    return await Parse._getInstallationId();
  }

  static async getInstance(): Promise<BaasiranMessaging> {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new BaasiranMessaging();
    await this.init();
    return this.instance;
  }

}

module.exports = BaasiranMessaging;
export default BaasiranMessaging;


