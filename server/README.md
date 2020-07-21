# rtclock-server

The service providing real-time clock via websocket.

## Installation

```bash
$ npm i
```

## API

**GET method**

 - /healthz - health check
 - /now - returns current date/time in `YYYY-MM-DD HH:mm:ss` format
 - /cal - exhausting calculation

```js
    let x = 0.0001;
    for (let i = 0; i <= 1000000; i++) {
        x += Math.sqrt(x);
    }
```

**WebSocket**

Just emit current date/time string via topic `now` to client who connected with the server.

```js
const timer = setInterval(() => {
    now = moment().format('YYYY-MM-DD HH:mm:ss');
    io.emit('now', now);
}, 100);
```

## Using Docker

```bash
$ (docker stop rtclock-server || :) && (docker rm rtclock-server || :)
$ docker run \
-p 3000:3000 \
--expose=3000 \
--name="rtclock-server" \
patharagls/rtclock:0.2.1-server
```

## License

MIT