// @flow
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  getAuth,
  getUser,
  callService,
  createConnection,
  subscribeConfig,
  subscribeEntities,
  ERR_INVALID_AUTH,
  AuthData
} from 'home-assistant-js-websocket';

interface HomeAssistantProps {
  url: string;
  setConnected: (connected: boolean) => void;
  setConfig: (config: any) => void;
  setEntities: (entities: any) => void;
}

export interface HomeAssistantEntityProps {
  hassConfig: any;
  hassEntities: any;
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
  } catch (err) {} // eslint-disable-line
  process.env.NODE_ENV === 'development' &&
    console.log('loadTokens:', hassTokens);
  return hassTokens;
}

export function saveTokens(tokens?: AuthData | null) {
  try {
    localStorage.setItem('hass_tokens', JSON.stringify(tokens));
  } catch (err) {} // eslint-disable-line
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
      () => {
        // setState({ snackMessage: { open: true, text: 'Changed.' } });
      },
      err => {
        console.error('Error calling service:', err);
        // setState({
        //   snackMessage: { open: true, text: 'Error calling service' },
        //   entities: undefined
        // });
      }
    );
  } else {
    callService(connection, domain, state ? 'turn_on' : 'turn_off', data).then(
      () => {
        // setState({ snackMessage: { open: true, text: 'Changed.' } });
      },
      err => {
        console.error('Error calling service:', err);
        // setState({
        //   snackMessage: { open: true, text: 'Error calling service' },
        //   entities: undefined
        // });
      }
    );
  }
}

function HomeAssistant(props: HomeAssistantProps) {
  useEffect(() => {
    if (!connected) connectToHASS();
  });

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

  async function connProm(auth: any) {
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
        // setState({
        //   snackMessage: {
        //     open: true,
        //     text: 'Connection to Home Assistant failed. Please try again later.'
        //   },
        //   entities: []
        // });
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
        subscribeEntities(conn, updateEntities);
        getUser(conn).then(user => {
          console.log('Logged into Home Assistant as', user.name);
          sessionStorage.setItem('hass_id', user.id);
        });
        connection = conn;
      });
    })();
  }

  function updateConfig(config: any) {
    props.setConfig({ ...config, url: props.url });
  }

  function updateEntities(entities: { [s: string]: {} } | ArrayLike<{}>) {
    props.setEntities(Object.entries(entities));
  }

  return null;
}

HomeAssistant.propTypes = {
  url: PropTypes.string.isRequired,
  setConnected: PropTypes.func.isRequired,
  setConfig: PropTypes.func.isRequired,
  setEntities: PropTypes.func.isRequired
};

export default HomeAssistant;
