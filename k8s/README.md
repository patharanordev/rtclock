# HPA in Kubernetes

**Horizontal Pod Autoscaler** or **HPA** using for auto-scaling pod based on specific criteria.

In this example using service name `rtclock` to POC.

You can test any service in localhost or development environment with [kind@k8s](https://patharanor.gitbook.io/kind-k8s/) except **HPA**, it requires high performance host. In this case I using `172.18.62.244` to be production instance.

## Requirement

 - High performance instance for cluster node and worker nodes
 - Any container/Docker image that you use, you **MUST** upload to internal registry first via `your.registry.ip`.
 - Private usage ( you cannot access to public network )
 - Command : `kubectl`, `docker`

## Container/Docker image

We using container image below:

 - yauritux/busybox-curl
 - patharagls/rtclock:0.2.1-server

To convert image tag from original to `your.registry.ip`, you can use command below:

```bash
# Example image tag : "patharagls/rtclock:0.2.1-server"

# Pull the original image tag
$ docker pull patharagls/rtclock:0.2.1-server

# Convert tag original to internal registry tag
$ docker tag patharagls/rtclock:0.2.1-server your.registry.ip/rtclock:0.2.1-server

# Push it to internal registry
$ docker push your.registry.ip/rtclock:0.2.1-server
```

The image ready to use now.

## Testing HPA

I assume you already setup `Kuberetes` successfully. 

### Prepare deployment script

Now I will create/apply my app(`rtclock`) with deployment script below to our Kuberetes:

```yaml
# Ref. k8s/prod/deploy-rtclock.yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: rtclock-server
spec:
  selector:
    matchLabels:
      run: rtclock-server
  replicas: 1
  template:
    metadata:
      labels:
        run: rtclock-server
    spec:
      containers:
      - name: rtclock-server
        image: your.registry.ip/rtclock:0.2.1-server
        ports:
        - containerPort: 3000
        resources:
          limits: # Ref. https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
            memory: 128Mi # Mi is megabytes
            cpu: 500m # m is milicore
          requests:
            cpu: 200m
---
apiVersion: autoscaling/v1
kind: HorizontalPodAutoscaler
metadata:
  name: rtclock-server
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: rtclock-server
  minReplicas: 1
  maxReplicas: 5
  targetCPUUtilizationPercentage: 50
---
kind: Service
apiVersion: v1
metadata:
  name: rtclock-server
  labels:
    run: rtclock-server
spec:
  selector:
    run: rtclock-server
  ports:
  - protocol: TCP
    port: 3000
---
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: rtclock-ingress
spec:
  rules:
  - http:
      paths:
      - path: /ws
        backend:
          serviceName: rtclock-server
          servicePort: 3000

```

### Deploy to K8s

Apply to K8s

```bash
$ kubectl apply -f deploy-rtclock.yaml
```

To list all items in our Kubernetes :

```bash
$ kubectl get all -A
```

Before increasing load to `rtclock` service, you need to know 2-commands below to check `CPU load` and `replica set`:

**Checking CPU work load**

```bash
# Checking CPU load
$ kubectl get hpa
```

**Checking Pod Sizing/ReplicaSet**

```bash
# Check resizing (replicas)
$ kubectl get deployment rtclock-server
```

### Let's increasing load

It hard to increase load directly to `rtclock` but you can deploy `busybox` image into same cluster of `rtclock` then calling specific endpoint of `rtclock` to increase load from exhaust calculation.

**Access busybox**

I called the service is `load-generator`. It will be removed after exited.

```
kubectl run -it --rm load-generator --image=your.registry.ip/busybox-curl:latest /bin/sh

# then hit enter 1 times or waiting busybox started
```

**Increasing load**

```
# Calcuation looping
while true; do wget -q -O- http://rtclock-server:3000/cal; done
```

You can see formular from [server script](../server/server.js).


In case CPU work load over CPU load limit (our providing resource in YAML file). It will autoscaling `rtclock`'s pod up until cover CPU work load. 

But in case you set amount of replica set, it will not scale over the limit. Although it's not cover CPU work load.

### Stop load

 - Press `<Ctrl> + C` to stop increasing load
 - Type "exit" + press `Enter` to exit `busybox`

### Waiting for scaling down

After stopped, please waiting for 
 - 1 minute for decreasing CPU usage
 - 3-5 minutes for autoscaling down the replica set

### Issues

**HPA in localhost**

I'm not suggest to run on localhost, except you have high performance machine. You can checking via command below:

```
$ kubectl get hpa

NAME             REFERENCE                   TARGETS         MINPODS   MAXPODS   REPLICAS   AGE
rtclock-server   Deployment/rtclock-server   <unknown>/50%   1         5         1          6h36m
```

If you see `<unknown>` in target column, it means your resources have not enough.

### License

MIT