import React from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Manager from './components/Manager/Manager';
import Mhome from './components/Manager/Mhome';
import ParticlesBg from 'particles-bg';
import 'bootstrap/dist/css/bootstrap.min.css';
 
class App extends React.Component {
  constructor() { 
    super();
    this.state = {
      isSignedIn: false,
      type: 'manager',
      route: 'signin',
      crm: 'store',
      option: 'insert'
    }
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name, 
      email: data.email,
    }})
  }

  OnRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false});
      this.setState({route: 'signin'});
      return;
    }
    if (route === 'manager') {
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  } 
  
  OnTableChange = (value) => {
    this.setState({crm: value});
  }

  render() {
    return (
      <div className="App">
       {this.state.route !== 'manager' && <ParticlesBg type="circle" bg={true} />}
        <Navigation isSignedIn={this.state.isSignedIn} OnRouteChange={this.OnRouteChange} type={this.state.type} crm={this.state.crm} OnTableChange={this.OnTableChange}/>
        { 
          this.state.route === 'manager' && this.state.isSignedIn === true?
          <Mhome crm={this.state.crm} OnRouteChange={this.OnRouteChange}/> :
          (
            this.state.route === 'signin' ?
            <Signin loadUser={this.loadUser} OnRouteChange={this.OnRouteChange}/> :
            ( 
              this.state.route === 'register' ?
              <Register loadUser={this.loadUser} OnRouteChange={this.OnRouteChange}/> :
              <Manager loadUser={this.loadUser} OnRouteChange={this.OnRouteChange}/>
            )
          )
        }
      </div>
    );
  }
} 

export default App;
