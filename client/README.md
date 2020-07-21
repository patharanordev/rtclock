# rtclock-client

## Installation

```bash
$ npm i
```

## Usage

**Development**

```bash
$ npm run dev
```

**Production**

```bash
# Export web app to static file
$ echo $WS_SERVER && \
export WS_SERVER=$WS_SERVER && \
npm run prod

# then serve it to user
$ npx serve out -p 3000
```