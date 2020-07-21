(docker stop rtclock-client || :) && (docker rm rtclock-client || :)
docker run \
-p 3000:3000 \
--expose=3000 \
--env WS_SERVER="http://rtclock-server" \
--env WS_PORT="3000" \
--name="rtclock-client" \
patharagls/rtclock:0.2.1-client