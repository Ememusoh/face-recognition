import React, {Component} from 'react';
import Navigation from './components/Navigation';
import Logo from './components/Logo';
import SignIn from './components/SignIn';
import Register from './components/Resigter';
import ImageLinkForm from './components/ImageLinkForm';
import Rank from './components/Rank';
import FaceRecgnition from './components/FaceRecognition';
import ParticlesBg from 'particles-bg';
import './App.css';


const returnClarifaiRequestOptions =(imageUrl)=>{
// Your PAT (Personal Access Token) can be found in the portal under Authentication
const PAT = '03235a9180ca41ba971ef22d28017067';
// Specify the correct user_id/app_id pairings
// Since you're making inferences outside your app's scope
const USER_ID = 'cc95gj8bwkyf';       
const APP_ID = 'test';  
const IMAGE_URL = imageUrl;

const raw = JSON.stringify({
  "user_app_id": {
      "user_id": USER_ID,
      "app_id": APP_ID
  },
  "inputs": [
      {
          "data": {
              "image": {
                  "url": IMAGE_URL
              }
          }
      }
  ]
});

const requestOptions = {
  method: 'POST',
  headers: {
      'Accept': 'application/json',
      'Authorization': 'Key ' + PAT
      // Key 03235a9180ca41ba971ef22d28017067 <= Output
  },
  body: raw
};

return requestOptions

}



class App extends Component {
  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route:'signin',
      isSignedIn: false

    }
    
  }
  
 calculateFaceLocation = (data) =>{
const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
// const clarifaiFace = data.outputs[0].regions[0].region_info.bounding_box;
const image = document.getElementById('inputimage');
const width = Number(image.width);
const height = Number(image.height);
return{
  leftCol: clarifaiFace.left_col * width,
  topRow: clarifaiFace.top_row * height,
  rightCol: width - (clarifaiFace.right_col * width),
  bottomRow: height - (clarifaiFace.bottom_row * height)
      }
 }

 displayFaceBox =(box)=>{
  this.setState({box: box});
 }

  onInputChange = (event) =>{
   this.setState({input:event.target.value});
  }

  onButtonSubmit = () =>{
    const MODEL_ID = 'face-detection'; 
    this.setState({imageUrl: this.state.input});

    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID +  "/outputs", returnClarifaiRequestOptions(this.state.input))
    .then(response => response.json())
    .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(error => console.log('error', error));


  }

  onRouteChange =(route) =>{
    if(route === 'signout'){
      this.setState({isSignedIn: false});
    } else if (route ==='home'){
      this.setState({isSignedIn:true})
    }
    this.setState({route:route});
  }

render(){
  const {isSignedIn, imageUrl, route, box} =this.state;
  return(
    <div className='App'>
      <ParticlesBg type="ball" bg={true}/>
      <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
      { route=== 'home'
      ? <div>
      <Logo/>
     <Rank/>
     <ImageLinkForm 
       onInputChange={this.onInputChange} 
       onButtonSubmit ={this.onButtonSubmit}/>
     <FaceRecgnition box ={box} imageUrl={imageUrl}/>
     </div>
      
      :(
        route==="signin"
        ? <SignIn onRouteChange ={this.onRouteChange} />
        : <Register onRouteChange ={this.onRouteChange} />
      )
      
       }
    </div>
        );
       }

     }

export default App;


