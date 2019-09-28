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

interface HomeAssistantProps {
  url: string;
  login: boolean;
  setConnected: (connected: boolean) => void;
  setAuth: (auth: Auth) => void;
  setConfig: (config: HassConfig) => void;
  setEntities: (entities: HassEntities) => void;
}

export interface HomeAssistantEntityProps {
  hassAuth: Auth;
  hassConfig: HassConfig;
  hassEntities: HassEntities;
}

export interface HomeAssistantChangeProps extends HomeAssistantEntityProps {
  handleHassChange?: (
    domain: string,
    state: string | boolean,
    data?: any
  ) => void;
}

export const entitySizes: {
  [key: string]: { height: number; width: number };
} = {
  air_quality: { height: 1, width: 1 },
  alarm_control_panel: { height: 2, width: 2 },
  binary_sensor: { height: 1, width: 1 },
  camera: { height: 1, width: 1 },
  climate: { height: 2, width: 2 },
  cover: { height: 1, width: 2 },
  device_tracker: { height: 1, width: 1 },
  fan: { height: 1, width: 2 },
  geo_location: { height: 1, width: 1 },
  input_boolean: { height: 1, width: 1 },
  input_select: { height: 1, width: 1 },
  light: { height: 4, width: 2 },
  lock: { height: 1, width: 1 },
  media_player: { height: 2, width: 2 },
  remote: { height: 1, width: 1 },
  scene: { height: 1, width: 1 },
  script: { height: 1, width: 1 },
  sensor: { height: 1, width: 1 },
  sun: { height: 1, width: 1 },
  switch: { height: 1, width: 1 },
  weather: { height: 2, width: 3 }
};

let connection: Connection, auth: Auth;

export function loadTokens() {
  let hassTokens;
  try {
    hassTokens = JSON.parse(String(localStorage.getItem('hass_tokens')));
  } catch (err) {}
  return hassTokens;
}

export async function saveTokens(tokens?: AuthData | null) {
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
  function eventHandler() {
    console.log('Home Assistant connection has been established again.');
  }

  const updateConfig = useCallback(
    (config: HassConfig) => {
      props.setConfig(config);
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
    if (!connection)
      (async () => {
        localStorage.setItem('hass_url', props.url);
        auth = await getAuth({
          hassUrl: props.url,
          saveTokens: saveTokens,
          loadTokens: () => Promise.resolve(loadTokens())
        });
        try {
          connection = await createConnection({ auth });
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
            connection = await createConnection({ auth });
          } catch (err) {
            throw err;
          }
        }
        props.setConnected(true);
        connection.removeEventListener('ready', eventHandler);
        connection.addEventListener('ready', eventHandler);
        props.setAuth(auth);
        subscribeConfig(connection, updateConfig);
        subscribeEntities(connection, updateEntites);
        getUser(connection).then((user: HassUser) => {
          console.log('Logged into Home Assistant as', user.name);
        });
      })();
  }, [props, updateConfig, updateEntites]);

  useEffect(() => {
    if (connection || !props.url || (!props.login && !loadTokens())) return;
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
