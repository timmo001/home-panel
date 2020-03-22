import { Auth } from 'home-assistant-js-websocket';

export async function handleFetchPromise<T>(
  fetchPromise: Promise<Response>
): Promise<T> {
  let response;

  try {
    response = await fetchPromise;
  } catch (err) {
    // eslint-disable-next-line
    throw {
      error: 'Request error',
      status_code: undefined,
      body: undefined,
    };
  }

  let body = null;

  const contentType = response.headers.get('content-type');

  if (contentType && contentType.includes('application/json')) {
    try {
      body = await response.json();
    } catch (err) {
      // eslint-disable-next-line
      throw {
        error: 'Unable to parse JSON response',
        status_code: err.status,
        body: null,
      };
    }
  } else {
    body = await response.text();
  }

  if (!response.ok) {
    // eslint-disable-next-line
    throw {
      error: `Response error: ${response.status}`,
      status_code: response.status,
      body,
    };
  }

  return (body as unknown) as T;
}

const fetchWithAuth = async (
  auth: Auth,
  input: RequestInfo,
  init: RequestInit = {}
): Promise<Response> => {
  if (auth.expired) {
    await auth.refreshAccessToken();
  }
  init.credentials = 'same-origin';
  if (!init.headers) {
    init.headers = {};
  }
  if (!init.headers) {
    init.headers = {};
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  init.headers.authorization = `Bearer ${auth.accessToken}`;
  return fetch(input, init);
};

export default async function hassCallApi<T>(
  auth: Auth,
  method: string,
  path: string,
  parameters?: {}
): Promise<T> {
  const url = `${auth.data.hassUrl}/api/${path}`;

  const init: RequestInit = {
    method,
    headers: {},
  };

  if (parameters) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    init.headers['Content-Type'] = 'application/json;charset=UTF-8';
    init.body = JSON.stringify(parameters);
  }

  return handleFetchPromise<T>(fetchWithAuth(auth, url, init));
}

export async function fetchHistory(
  auth: Auth,
  entity: string,
  start: Date,
  end: Date
): Promise<unknown> {
  let url = 'history/period';
  if (start) url += `/${start.toISOString()}`;
  url += `?filter_entity_id=${entity}`;
  if (end) url += `&end_time=${end.toISOString()}`;
  if (process.env.NODE_ENV === 'development') console.log('fetchHistory:', url);
  return hassCallApi(auth, 'GET', url);
}
