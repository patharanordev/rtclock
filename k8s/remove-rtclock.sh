(kubectl delete pod rtclock-server || :) && \
(kubectl delete pod rtclock-client || :) && \
(kubectl delete service rtclock-server || :) && \
(kubectl delete service rtclock-client || :) && \
(kubectl delete deployment rtclock-server || :) && \
(kubectl delete deployment rtclock-client || :) && \
(kubectl delete horizontalpodautoscaler rtclock-server || :) && \
(kubectl delete horizontalpodautoscaler rtclock-client || :)