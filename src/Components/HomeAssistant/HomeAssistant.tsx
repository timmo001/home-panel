// @flow
import { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Auth,
  AuthData,
  callService,
  Connection,
  createConnection,
  ERR_HASS_HOST_REQUIRED,
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

let connection: Connection,
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

export async function saveTokens(tokens?: AuthData | null) {
  try {
    await localStorage.setItem('hass_tokens', JSON.stringify(tokens));
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
  function eventHandler() {
    console.log('Home Assistant connection has been established again.');
  }

  const updateConfig = useCallback(
    (config: HassConfig) => {
      props.setConfig({ ...config, url: props.url });
    },
    [props]
  );

  const updateEntites = useCallback(
    (entities: HassEntities) => {
      props.setEntities(entities);
    },
    [props]
  );

  const connectToHASS = useCallback(() => {
    (async () => {
      process.env.NODE_ENV === 'development' && console.log('connectToHASS');
      localStorage.setItem('hass_url', props.url);
      let conn: Connection;
      let auth: Auth = await getAuth({
        hassUrl: props.url,
        saveTokens: saveTokens,
        loadTokens: () => Promise.resolve(loadTokens())
      });
      try {
        conn = await createConnection({ auth });
      } catch (err) {
        try {
          if (err !== ERR_HASS_HOST_REQUIRED) {
            throw err;
          }
          if (err !== ERR_INVALID_AUTH) {
            throw err;
          }
          // We can get invalid auth if auth tokens were stored that are no longer valid
          // Clear stored tokens.
          saveTokens();
          auth = await getAuth({
            hassUrl: props.url,
            saveTokens: saveTokens,
            loadTokens: () => Promise.resolve(loadTokens())
          });
          conn = await createConnection({ auth });
        } catch (err) {
          throw err;
        }
      }
      props.setConnected(true);
      connected = true;
      conn.removeEventListener('ready', eventHandler);
      conn.addEventListener('ready', eventHandler);
      subscribeConfig(conn, updateConfig);
      subscribeEntities(conn, updateEntites);
      getUser(conn).then((user: HassUser) => {
        console.log('Logged into Home Assistant as', user.name);
      });
      connection = conn;
    })();
  }, [props, updateConfig, updateEntites]);

  useEffect(() => {
    if (connected || !props.url || (!props.login && !loadTokens())) return;
    connectToHASS();
  }, [props.login, props.url, connectToHASS]);

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
