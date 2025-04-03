import {
  provideKeycloak,
  createInterceptorCondition,
  IncludeBearerTokenCondition,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  withAutoRefreshToken,
  AutoRefreshTokenService,
  UserActivityService
} from 'keycloak-angular';

const localhostCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
  urlPattern: /^(http:\/\/localhost:8081)(\/.*)?$/i
});

export const provideKeycloakAngular = () =>
  provideKeycloak({
    config: {
      realm: 'encotech',
      url: 'http://localhost:8082',
      clientId: 'enco-prosamp-angular-ui'
    },
    initOptions: {
      // onLoad: 'check-sso',
      onLoad: 'login-required',
      silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
      redirectUri: window.location.origin + '/'
    },
    features: [
      withAutoRefreshToken({
        onInactivityTimeout: 'logout',
        sessionTimeout: 1800000
      })
    ],
    providers: [
      AutoRefreshTokenService,
      UserActivityService,
      {
        provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
        useValue: [localhostCondition]
      }
    ]
  });
