import React from 'react';
import io from 'socket.io-client';

class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            socket:null,
            timing: '',
            wsserver: process.env.WS_SERVER | "",
            wsport: 3000
        };
    }
    
    componentDidMount() {

        this.socket = io(`${this.state.wsserver}:${this.state.wsport}`);

        this.socket.on('connect', () => {
            console.log('Connected to server.');
        });

        this.socket.on('now', (data) => {
            console.log('timing:', data);
            this.setState({ 'timing' : data });
        });

        this.socket.on('disconnect', function(){
            console.log('Disconnected from server.');
        });

        this.setState({ socket: this.socket });
    }

    render() {
        return (
            <div>{ this.state.timing }</div>
        )
    }
}

export default MainPage