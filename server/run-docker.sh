(docker stop rtclock-server || :) && (docker rm rtclock-server || :)
docker run \
-p 3000:3000 \
--expose=3000 \
--name="rtclock-server" \
patharagls/rtclock:0.2.1-server