
/**
 * Contains all Baasiran API classes and functions.
 */

const BaasiranUtils = {

  getBrowserDetail: function (): object {

    const result: string = ((): string =>{
      const ua: string = navigator.userAgent;
      let tem;
      let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
      if(/trident/i.test(M[1])){
        tem =  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE ' + (tem[1] || '?');
      }
      if(M[1] === 'Chrome'){
        tem = ua.match(/\b(OPR|Edge|Edg)\/(\d+)/);
        if(tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera').replace('Edg', 'Edge');
      }
      M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
      if((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
      return M.join(' ');
    })();

    const resultObject: string[] = result.split(' ');
    return {name: resultObject[0], version: resultObject[1]};
  },

  getTime: function (): number {
    return new Date().getTime();
  },

  checkNotificationSupport: function (): boolean {
    return "Notification" in window;
  },

  checkServiceWorkerSupport: function (): boolean {
    return "serviceWorker" in navigator;
  },

  checkPushManagerSupport: function (): boolean {
    return "PushManager" in window;
  },

  mobileAndTabletCheck: function(): boolean {
    let check = false;
    (function(a){
      if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(a)) check = true;
    })(navigator.userAgent);
    return check;
  },

  requestNotificationPermission: async function (): Promise<string> {
    // value of permission can be 'granted', 'default', 'denied'
    // granted: user has accepted the request
    // default: user has dismissed the notification permission popup by clicking on x
    // denied: user has denied the request.
    return await window.Notification.requestPermission();
  },

  showLocalNotification: function (payload: string): Notification {
    const payloadObj = JSON.parse(payload);
    const options = {
      body: payloadObj.alert,
      // here you can add more properties like icon, image, vibrate, etc.
    };
    return new Notification(payloadObj.title, options);
  },

  showMobileNotification: async function (payload: string, swRegistration: ServiceWorkerRegistration): Promise<void> {
    const payloadObj = JSON.parse(payload);
    const options = {
      body: payloadObj.alert,
      // here you can add more properties like icon, image, vibrate, etc.
    };
    return await swRegistration.showNotification(payloadObj.title, options);
  },

  generateRandomPassword(length: number = 12): string {
    const upper: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower: string = 'abcdefghijklmnopqrstuvwxyz';
    const numbers: string = '0123456789';
    const symbols: string = '!@#$%^&*()_+[]{}<>?,.';
    const allChars: string = upper + lower + numbers + symbols;
    let password: string = '';
    password += upper[Math.floor(Math.random() * upper.length)];
    password += lower[Math.floor(Math.random() * lower.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    for (let i: number = 4; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    return password.split('').sort(() => 0.5 - Math.random()).join('');
  }
}

module.exports = BaasiranUtils;
export default BaasiranUtils;
