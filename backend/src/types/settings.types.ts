export interface Settings {
  profile: {
    username: string;
    email: string;
    password: string;
    isPremium: boolean;
  };
  privacyAndSecurity: {
    isPrivate: boolean;
  };
  notifications: {
    email: boolean;
    push: boolean;
  };
  accountManagement: {
    user: string;
  };
  connectedAppsAndIntegrations: {
    thirdPartyAppConnection: string;
  };
  paymentAndBilling: {
    history: string[];
  };
}
