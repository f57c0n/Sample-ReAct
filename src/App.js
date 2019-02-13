
//https://i.pinimg.com/736x/5d/d5/35/5dd5353a11972f2d140c2a889cee26da.jpg
//https://i.pinimg.com/originals/2a/76/0a/2a760a9c09fe9f7ed7391749b27dc012.jpg
import React, { Component } from 'react';
import './App.css';
//https://www.npmjs.com/package/react-particles-js  => to use Particles effect
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
//https://clarifai.com/developer/welcome/   => npm install clarifai
//const Clarifai = require('clarifai');
//import Clarifai from 'clarifai';    => remove to the back-end to protect authorization key

// Instantiate a new Clarifai app by passing in your API key.  => move to back end
// const app = new Clarifai.App({
//   apiKey: '8bf7c0a62cd94a5c8b667a30546645f4'
// });

//must import particles fron react
/*
const particlesOptions1 = {
  particles: {
    line_linked: {
    shadow: {
        enable: true,
        color: "#3CA9D1",
        blur: 5
      }
    }
  }
}
*/

const particlesOptions = {
  particles: {
    number: {
      value: 70,
      density: {
        enable: true,
        value_area: 700
      }
    }
  }
}

//SET INITIAL STATE => so that app clears the previous state
const initialState = {
  input: '',
  imageUrl: '',
  //box is initialized as an empty object, later on populated by calculateFaceLocation with leftCol, etc ... as passed to displayFaceBox
  box: {},
  
  route: 'signin',
  isSignedIn: false,
  //to hold user info and update this with register information
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor(){
    super();
    this.state= initialState;
  }

  /* TESTING CONNECTION
  //needs npm cors to allow access control to local host from react-app
  //npmjs.com/package/cors for documentation
  //npm install cors
  componentDidMount() {
    fetch('http://localhost:3000/')
    .then(response => response.json())
    //.then(data => console.log(data))    -> is the same as below or .then(data)
    .then(console.log)
  }
  */

 loadUser = (data) => {
  this.setState({user: {
    id: data.id,
    name: data.name,
    email: data.email,
    entries: data.entries,
    joined: data.joined
  }})
}

  calculateFaceLocation = (data) => {
    //capture this through the console as being returned from onSubmit
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    //create the id 'inputimage' to FaceRecognition to id the image
    const image = document.getElementById('inputimage');
    //Number ensures the image.width is/coverted to a number
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width, height)
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  //event.target.value => captures actual inputted value
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  //https://clarifai.com/models/face-detection-image-recognition-model-a403429f2ddf4b49b307e318f00e528b-detection
  //read up on Object.assign -> target specific field
  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    // app.models
    //   .predict(
    //     Clarifai.FACE_DETECT_MODEL,
    //     this.state.input)
    // ADD imageUrl stuff from back end
      fetch('http://localhost:3000/imageUrl', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              input: this.state.input
            })
          })
      .then(response => response.json())  //=> to ensure that that the returned responsed is formatted correctly
      .then(response => {
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            //entry is the response from the what server returns under app.put('/image')
            .then(entry => {
              this.setState(Object.assign(this.state.user, { entries: entry}))
            })
            .catch(console.log)
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
    /*
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route === 'home') 
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
    */
  }

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    //can't do conditional inside return, must enclose in braces
    return (
      <div className="App">
      <Particles className="particles"
        params={particlesOptions}
        /*style={{
          width: '100%',
          backgroundImage: `url(${logo})` 
        }}*/
      />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home'
          ? <div> {/*must wrap/div multiple returns in JSx*/}
          <Logo />
          <Rank
            name={this.state.user.name}
            entries={this.state.user.entries} 
          />
          <ImageLinkForm 
            onInputChange={this.onInputChange} 
            onButtonSubmit={this.onButtonSubmit}
          />
          <FaceRecognition 
            box={box}
            imageUrl={imageUrl}/>
          </div>
          :(
            route ==='signin'
            ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          )
          
        }
      </div>
    );
  }
}


export default App;
