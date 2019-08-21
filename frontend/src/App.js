import React, { Component } from 'react';
import { GoogleLogin } from 'react-google-login';
import config from './config.json';
import { subscribeToTimer, subscribeToTimer1 } from './api';

class App extends Component {

    constructor() {
        super();

        subscribeToTimer((err, timestamp) => this.setState({ 
          timestamp 
        }));
        
        this.state = { isAuthenticated: false, user: null, token: '', timestamp: 'no timestamp yet', timestamp1: ''};
    }

    logout = () => {
        this.setState({isAuthenticated: false, token: '', user: null})
    };

    onFailure = (error) => {
        alert(error);
    };

    

    googleResponse = (response) => {
        const tokenBlob = new Blob([JSON.stringify({access_token: response.accessToken}, null, 2)], {type : 'application/json'});
        const options = {
            method: 'POST',
            body: tokenBlob,
            mode: 'cors',
            cache: 'default'
        };
        fetch('http://localhost:4000/api/v1/auth/google', options).then(r => {
            const token = r.headers.get('x-auth-token');
            r.json().then(user => {
                if (token) {
                    this.setState({isAuthenticated: true, user, token})
                }
            });
        })
    };


    buttonClick = (value) => {
     subscribeToTimer1((err, timestamp1) => this.setState({ 
          timestamp1
        }));
    };

    render() {
    let content = !!this.state.isAuthenticated ?
            (
                <div>
                    <p>Authenticated</p>
                    <div>
                        {this.state.user.email}
                    </div>
                    <div>
                       <iframe src="https://www.youtube.com/embed/tgbNymZ7vqY"/>
                       <br/>
                        <button onClick={this.logout} className="button">
                            Log out
                        </button>
                    </div>
                    <div className="appppppp">
                      <p className="App-intro">
                      This is the timer value: {this.state.timestamp}
                      </p>
                    </div>
                    <button type="button" onClick={() => this.buttonClick("hello my name is asheesh mourya")}>Click Me!</button>

                    <div className="">
                      <p className="">
                      This is the timer value: {this.state.timestamp1}
                      </p>
                    </div>

                </div>
            ) :
            (
                <div>
                    
                    <GoogleLogin
                        clientId={config.GOOGLE_CLIENT_ID}
                        buttonText="Login with Google Account"
                        onSuccess={this.googleResponse}
                        onFailure={this.onFailure}
                    />
                </div>
            );

        return (
            <div className="App">
                {content}
            </div>
        );
    }
}

export default App;
