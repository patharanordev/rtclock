const moment = require('moment');
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

var now = 'YYYY-MM-DD HH:mm:ss';

const timer = setInterval(() => {
    now = moment().format('YYYY-MM-DD HH:mm:ss');
    io.emit('now', now);
    // console.log('Timer :', timeStr);
}, 100);

app.get('/healthz', (req, res) => res.send('ok'));
app.get('/now', (req, res) => {
    res.send(now);
});
app.get('/cal', (req, res) => {
    let x = 0.0001;
    for (let i = 0; i <= 1000000; i++) {
        x += Math.sqrt(x);
    }
    res.send('calculated');
});

io.on('connection', client => {
        
    console.log('Client accessing...');

    client.on('event', data => {
        console.log('Event:', data);
    });
    
    client.on('disconnect', () => {
        console.log('Client disconnected.');
    });
});

server.listen(3000);