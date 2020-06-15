import {
  AuthData,
  ERR_INVALID_AUTH,
  genExpires,
  ERR_INVALID_HTTPS_TO_HTTP,
} from 'home-assistant-js-websocket';
import { saveTokens } from '../HomeAssistant';
import queryString from 'query-string';

type OAuthState = {
  hassUrl: string;
  clientId: string;
};

type AuthorizationCodeRequest = {
  grant_type: 'authorization_code';
  code: string;
};

type RefreshTokenRequest = {
  grant_type: 'refresh_token';
  refresh_token: string;
};

function decodeOAuthState(encoded: string): OAuthState {
  return JSON.parse(atob(encoded));
}

async function tokenRequest(
  hassUrl: string,
  clientId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: AuthorizationCodeRequest | RefreshTokenRequest | any
): Promise<AuthData> {
  // Browsers don't allow fetching tokens from https -> http.
  // Throw an error because it's a pain to debug this.
  // Guard against not working in node.
  const l = typeof window.location !== 'undefined' && window.location;
  if (l && l.protocol === 'https:') {
    // Ensure that the hassUrl is hosted on https.
    const a = document.createElement('a');
    a.href = hassUrl;
    if (a.protocol === 'http:' && a.hostname !== 'localhost') {
      throw ERR_INVALID_HTTPS_TO_HTTP;
      // return null;
    }
  }

  const formData = new FormData();
  formData.append('client_id', clientId);
  Object.keys(data).forEach((key: string) => {
    formData.append(key, data[key]);
  });

  const resp = await fetch(`${hassUrl}/auth/token`, {
    method: 'POST',
    credentials: 'same-origin',
    body: formData,
  });

  if (!resp.ok) {
    throw resp.status === 400 /* auth invalid */ ||
      resp.status === 403 /* user not active */
      ? ERR_INVALID_AUTH
      : new Error('Unable to fetch tokens');
  }

  const tokens: AuthData = await resp.json();
  tokens.hassUrl = hassUrl;
  tokens.clientId = clientId;
  tokens.expires = genExpires(tokens.expires_in);
  return tokens;
}

async function fetchToken(
  hassUrl: string,
  clientId: string,
  code: string
): Promise<AuthData> {
  return tokenRequest(hassUrl, clientId, {
    code,
    grant_type: 'authorization_code',
  });
}
export async function parseTokens(): Promise<void> {
  let data: AuthData | null | undefined;
  const query = queryString.parse(window.location.search);
  // Check if we got redirected here from authorize page
  if ('auth_callback' in query) {
    // Restore state
    if (typeof query.state === 'string' && typeof query.code === 'string') {
      const state = decodeOAuthState(query.state);
      data = await fetchToken(state.hassUrl, state.clientId, query.code);
      if (data) {
        await saveTokens(data);
        window.location.replace(
          window.location.href.replace(window.location.search, '')
        );
      }
    }
  }
}
