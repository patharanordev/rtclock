docker build -t patharagls/rtclock:0.2.1-client .

# For testing :
#  - websocat 'http://127.0.0.1:8001/api/v1/namespaces/default/services/ws:rtclock-server-service:3000/proxy/'
#  - websocat 'ws://localhost:3000/socket.io/?EIO=3&transport=websocket'