import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

(window as any).Pusher = Pusher;

const host = import.meta.env.VITE_REVERB_HOST || '127.0.0.1';
const port = parseInt(import.meta.env.VITE_REVERB_PORT || '8080', 10);
const scheme = import.meta.env.VITE_REVERB_SCHEME || 'http';

const echo = new Echo({
  broadcaster: 'reverb',
  key: import.meta.env.VITE_REVERB_APP_KEY || 'onedata_key',
  wsHost: host,
  wsPort: port,
  wssPort: port,
  forceTLS: scheme === 'https',
  enabledTransports: ['ws', 'wss'],
  disableStats: true,
});

export default echo;
