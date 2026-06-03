import Parse from './Parse';
import ParseUser from './ParseUser';
import baasiranAuth from './BaasiranAuth';

class BaasiranAuth {

  private static instance: BaasiranAuth;

  // Function names
  private static SEND_OTP_FUNCTION: string = 'send_otp';
  private static VERIFY_OTP_FUNCTION: string = 'verify_otp';
  private static SIGNIN_WITH_GOOGLE: string = 'customGoogle';
  private static LOGIN_WITH_SMS: string = 'loginWithSms';
  private static LOGIN_WITH_GOOGLE: string = 'loginWithGoogle';

  // Keys
  private static USERNAME_KEY: string = 'username';
  private static EMAIL_KEY: string = 'email';
  private static OTP_METHOD_KEY: string = 'method';
  private static TYPE_KEY: string = 'type';
  private static OTP_KEY: string = 'otp';
  private static PHONE_KEY: string = 'phone';
  private static PHONE_NUMBER_KEY: string = 'phoneNumber';
  private static PASSWORD_KEY: string = 'password';
  private static GOOGLE_ID_TOKEN: string = 'googleIdToken';
  private static GOOGLE_CLIENT_ID: string = 'googleClientId';

  // Values
  private static OTP_METHOD_EMAIL_VALUE: string = 'email';
  private static OTP_METHOD_PHONE_VALUE: string = 'phone';
  private static OTP_TYPE_SIGNUP_VALUE: string = 'signUp';
  private static OTP_TYPE_RESET_PASSWORD_VALUE: string = 'resetPassword';

  private constructor() {

  }

  static getValue(key: string): string {
    return BaasiranAuth[key];
  }

  static async sendOtpToPhone(phoneNumber: string): Promise<any> {
    const params = {
      [this.OTP_METHOD_KEY]: this.OTP_METHOD_PHONE_VALUE,
      [this.PHONE_KEY]: phoneNumber,
      [this.TYPE_KEY]: this.OTP_TYPE_SIGNUP_VALUE,
    };
    return await Parse.Cloud.run(this.SEND_OTP_FUNCTION, params, {});
  }

  private static async init(): Promise<void> {

  }

  async getToken(): Promise<string> {
    return await Parse._getInstallationId();
  }

  static async getInstance(): Promise<BaasiranAuth> {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new BaasiranAuth();
    await this.init();
    return this.instance;
  }

  //EmailAndPassword
  async createUserWithEmailAndPassword(email: string, password: string): Promise<ParseUser> {
    const user = new Parse.User();
    user.set(baasiranAuth.getValue('USERNAME_KEY'), email);
    user.set(baasiranAuth.getValue('PASSWORD_KEY'), password);
    user.set(baasiranAuth.getValue('EMAIL_KEY'), email);
    return await user.signUp({});
  }

  async sendOtpToEmail(email: string): Promise<any> {
    const params = {
      [baasiranAuth.getValue('OTP_METHOD_KEY')]: baasiranAuth.getValue('OTP_METHOD_EMAIL_VALUE'),
      [baasiranAuth.getValue('EMAIL_KEY')]: email,
      [baasiranAuth.getValue('TYPE_KEY')]: baasiranAuth.getValue('OTP_TYPE_SIGNUP_VALUE'),
    };
    return await Parse.Cloud.run(baasiranAuth.getValue('SEND_OTP_FUNCTION'), params, {});
  }

  async validateEmailWithOtp(email: string, otp: string): Promise<any> {
    const params = {
      [baasiranAuth.getValue('OTP_METHOD_KEY')]: baasiranAuth.getValue('OTP_METHOD_EMAIL_VALUE'),
      [baasiranAuth.getValue('EMAIL_KEY')]: email,
      [baasiranAuth.getValue('TYPE_KEY')]: baasiranAuth.getValue('OTP_TYPE_SIGNUP_VALUE'),
      [baasiranAuth.getValue('OTP_KEY')]: otp,
    };
    return await Parse.Cloud.run(baasiranAuth.getValue('VERIFY_OTP_FUNCTION'), params, {});
  }

  async signInWithEmailAndPassword(email: string, password: string): Promise<ParseUser> {
    return await Parse.User.logIn(email, password);
  }

  async sendResetPasswordOtpToEmail(email: string): Promise<any> {
    const params = {
      [baasiranAuth.getValue('OTP_METHOD_KEY')]: baasiranAuth.getValue('OTP_METHOD_EMAIL_VALUE'),
      [baasiranAuth.getValue('EMAIL_KEY')]: email,
      [baasiranAuth.getValue('TYPE_KEY')]: baasiranAuth.getValue('OTP_TYPE_RESET_PASSWORD_VALUE'),
    };
    return await Parse.Cloud.run(baasiranAuth.getValue('SEND_OTP_FUNCTION'), params, {});
  }

  async resetPasswordWithEmailedOtp(email: string, otp: string, newPassword: string): Promise<any> {
    const params = {
      [baasiranAuth.getValue('OTP_METHOD_KEY')]: baasiranAuth.getValue('OTP_METHOD_EMAIL_VALUE'),
      [baasiranAuth.getValue('EMAIL_KEY')]: email,
      [baasiranAuth.getValue('TYPE_KEY')]: baasiranAuth.getValue('OTP_TYPE_RESET_PASSWORD_VALUE'),
      [baasiranAuth.getValue('OTP_KEY')]: otp,
      [baasiranAuth.getValue('PASSWORD_KEY')]: newPassword,
    };
    return await Parse.Cloud.run(baasiranAuth.getValue('VERIFY_OTP_FUNCTION'), params, {});
  }

  //PhoneNumber
  async signUpWithPhoneNumber(phoneNumber: string): Promise<ParseUser> {
    return await BaasiranAuth.sendOtpToPhone(phoneNumber);
  }

  async verifyPhoneNumber(phoneNumber: string, otp: string): Promise<any> {
    const params = {
      [baasiranAuth.getValue('PHONE_NUMBER_KEY')]: phoneNumber,
      [baasiranAuth.getValue('OTP_KEY')]: otp,
    };
    const res =  await Parse.Cloud.run(baasiranAuth.getValue('LOGIN_WITH_SMS'), params, {});
    const sessionToken = res.sessionToken;
    return await Parse.User.become(sessionToken);
  }

  //Anonymous
  async signInAnonymously(): Promise<ParseUser> {
    return await Parse.AnonymousUtils.logIn();
  }

  async convertAnonymousToUser(email: string, password: string): Promise<ParseUser> {
    const currentUser = Parse.User.current();
    if (!currentUser) {
      throw new Error('No anonymous user is currently signed in.');
    }
    const authData = currentUser.get('authData');
    if (!authData || !authData.anonymous) {
      throw new Error('Current user is not anonymous.');
    }
    currentUser.set(baasiranAuth.getValue('USERNAME_KEY'), email);
    currentUser.set(baasiranAuth.getValue('PASSWORD_KEY'), password);
    currentUser.set(baasiranAuth.getValue('EMAIL_KEY'), email);
    return await currentUser.signUp({});
  }

  async isAnonymous(): Promise<boolean> {
    const currentUser = Parse.User.current();
    if (!currentUser) {
      return false;
    }
    const authData = currentUser.get('authData');
    return !!(authData && authData.anonymous);
  }

  //customGoogle
  async signInWithGoogle(googleClientId: string, googleIdToken: string): Promise<ParseUser> {
    const params = {
      [baasiranAuth.getValue('GOOGLE_ID_TOKEN')]: googleIdToken,
      [baasiranAuth.getValue('GOOGLE_CLIENT_ID')]: googleClientId,
    };
    const res =  await Parse.Cloud.run(baasiranAuth.getValue('LOGIN_WITH_GOOGLE'), params, {});
    const sessionToken = res.sessionToken;
    return await Parse.User.become(sessionToken);
  }

  //myGov
  signInWithMyGov(myGovClientId: string, redirectURI: string) {
    const clientId: string = myGovClientId;
    const redirectUri: string = redirectURI;
    const state = `web-${crypto.randomUUID()}`;
    const nonce = crypto.randomUUID();
    const authUrl = `https://sso.my.gov.ir/oauth2/authorize?` +
      `response_type=code&` +
      `scope=openid profile&` +
      `client_id=${clientId}&` +
      `state=${state}&` +
      `nonce=${nonce}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}`;
    localStorage.setItem('mygov_state', state);
    localStorage.setItem('mygov_client_id', clientId);
    window.location.href = authUrl;
  }

  async handleMyGovCallback() {

    const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
    const code: string = urlParams.get('code');
    const state: string = urlParams.get('state');
    const storedState: string = localStorage.getItem('mygov_state');
    const storedClientId: string = localStorage.getItem('mygov_client_id');

    if (!code || !state || !storedClientId) return;

    if (state !== storedState) return;
    
    const clientId: string = storedClientId
    localStorage.removeItem('mygov_state');
    localStorage.removeItem('mygov_client_id');
    const result = await Parse.Cloud.run('loginWithMyGov', { code, clientId, state }, {});
    localStorage.setItem('loginMethod', 'sso');
    window.history.replaceState({}, document.title, window.location.pathname);
    return await Parse.User.become(result.sessionToken);
  }

  async signOut(): Promise<void> {
    return await Parse.User.logOut();
  }

  async getCurrentUser(): Promise<ParseUser | null> {
    return await Parse.User.currentAsync();
  }
}

module.exports = BaasiranAuth;
export default BaasiranAuth;