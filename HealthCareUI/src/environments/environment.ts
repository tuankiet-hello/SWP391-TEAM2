import { environment } from "../app/app.config";

export const environments = {
  production: false,
  apiAuthUrl: environment + '/api/auth',
  apiAccountsUrl: environment + '/api/accounts'
};
