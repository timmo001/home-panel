// @flow
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Auth,
  AuthData,
  callService,
  createConnection,
  ERR_INVALID_AUTH,
  getAuth,
  getUser,
  HassConfig,
  HassEntities,
  HassUser,
  subscribeConfig,
  subscribeEntities
} from 'home-assistant-js-websocket';

export declare type HassConfigExt = HassConfig & {
  url: string;
};

interface HomeAssistantProps {
  url: string;
  login: boolean;
  setConnected: (connected: boolean) => void;
  setConfig: (config: HassConfigExt) => void;
  setEntities: (entities: HassEntities) => void;
}

export interface HomeAssistantEntityProps {
  hassConfig: HassConfigExt;
  hassEntities: HassEntities;
}

export interface HomeAssistantChangeProps extends HomeAssistantEntityProps {
  handleHassChange?: (
    domain: string,
    state: string | boolean,
    data?: any
  ) => void;
}

let connection: any,
  connected: boolean = false;

export function loadTokens() {
  let hassTokens;
  try {
    hassTokens = JSON.parse(String(localStorage.getItem('hass_tokens')));
  } catch (err) {}
  process.env.NODE_ENV === 'development' &&
    console.log('loadTokens:', hassTokens);
  return hassTokens;
}

export function saveTokens(tokens?: AuthData | null) {
  try {
    localStorage.setItem('hass_tokens', JSON.stringify(tokens));
  } catch (err) {}
}

export function handleChange(
  domain: string,
  state: string | boolean,
  data?: any
) {
  process.env.NODE_ENV === 'development' &&
    console.log('handleChange:', domain, state, data);
  if (typeof state === 'string') {
    callService(connection, domain, state, data).then(
      () => {},
      err => {
        console.error('Error calling service:', err);
      }
    );
  } else {
    callService(connection, domain, state ? 'turn_on' : 'turn_off', data).then(
      () => {},
      err => {
        console.error('Error calling service:', err);
      }
    );
  }
}

function HomeAssistant(props: HomeAssistantProps) {
  useEffect(() => {
    if (connected || !props.url || (!props.login && !loadTokens())) return;
    connectToHASS();
  }, [props.url, props.login, connectToHASS]);

  function eventHandler() {
    console.log('Home Assistant connection has been established again.');
  }

  function authProm() {
    return getAuth({
      hassUrl: props.url,
      saveTokens: saveTokens,
      loadTokens: () => Promise.resolve(loadTokens())
    });
  }

  async function connProm(auth: Auth) {
    try {
      const conn = await createConnection({ auth });
      return { auth, conn };
    } catch (err) {
      try {
        if (err !== ERR_INVALID_AUTH) {
          throw err;
        }
        // We can get invalid auth if auth tokens were stored that are no longer valid
        // Clear stored tokens.
        saveTokens();
        auth = await authProm();
        const conn = await createConnection({ auth });
        return { auth, conn };
      } catch (err) {
        throw err;
      }
    }
  }

  function connectToHASS() {
    process.env.NODE_ENV === 'development' && console.log('connectToHASS');
    (async () => {
      localStorage.setItem('hass_url', props.url);
      const conn = authProm().then(connProm);
      conn.then(({ conn }) => {
        localStorage.removeItem('auth_triggered');
        props.setConnected(true);
        connected = true;
        conn.removeEventListener('ready', eventHandler);
        conn.addEventListener('ready', eventHandler);
        subscribeConfig(conn, updateConfig);
        subscribeEntities(conn, updateEntites);
        getUser(conn).then((user: HassUser) => {
          console.log('Logged into Home Assistant as', user.name);
          sessionStorage.setItem('hass_id', user.id);
        });
        connection = conn;
      });
    })();
  }

  function updateConfig(config: HassConfig) {
    props.setConfig({ ...config, url: props.url });
  }

  function updateEntites(entities: HassEntities) {
    props.setEntities(entities);
  }

  return null;
}

HomeAssistant.propTypes = {
  url: PropTypes.string.isRequired,
  login: PropTypes.bool.isRequired,
  setConnected: PropTypes.func.isRequired,
  setConfig: PropTypes.func.isRequired,
  setEntities: PropTypes.func.isRequired
};

export default HomeAssistant;
