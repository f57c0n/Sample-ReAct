//import from from tachyons
//tachyons.io/components/forms/sign-in/index.html  and article is from tachyon card
//note that the syntax from original is wrong
//with JSx, input tags need to be closed off
import React from 'react';

//remember to put onRouteChange in braces{} because state is an object
//const Signin = ({onRouteChange}) => {
class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signInEmail: '',
      signInPassword: ''
    }
  }

  onEmailChange = (event) => {
    this.setState({signInEmail: event.target.value})
  }

  onPasswordChange = (event) => {
    this.setState({signInPassword: event.target.value})
  }

  /*
  //TESTING CAPTURE OF EMAIL AND PASSWORD
  onSubmitSignIn = () => {
    console.log(this.state)
    this.props.onRouteChange('home')
  }
  */

  //NOTE:  fetch by default is a get request, but we want a post here.  hence we specify an object that specifies method is post
  onSubmitSignIn = () => {
    fetch('http://localhost:3000/signin', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      //since we can't send JS objects to back end we need to convert it to JSON
      body: JSON.stringify({
        email: this.state.signInEmail,
        password: this.state.signInPassword
      })
    })
      .then(response => response.json())
      // .then(data => {
      //   if (data === 'Signed-in Successfully'){
      //     this.props.onRouteChange('home');
      //   }
      // })
      .then(user => {
        if (user.id) {
          this.props.loadUser(user)
          this.props.onRouteChange('home');
        }
      })
  }

  render() {
    const {onRouteChange} = this.props;
    return (
      <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
      <main className="pa4 black-80">
        {/*instead of form use div because we are not submitting a form when going into backend */}
        <div className="measure">
        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
            <legend className="f1 fw6 ph0 mh0">Sign In</legend>
            <div className="mt3">
              <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
              <input 
                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                type="email" 
                name="email-address"  
                id="email-address"
                onChange={this.onEmailChange}
              />
            </div>
            <div className="mv3">
              <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
              <input 
                className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                type="password" 
                name="password"  
                id="password"
                onChange={this.onPasswordChange}
                //calls on onPasswordChange function that captures the event.target.value to change state
              />
            </div>
            {/*<label className="pa0 ma0 lh-copy f6 pointer"><input type="checkbox"/> Remember me</label>*/}
        </fieldset>
        <div className="">
          <input 
            //onClick={onRouteChange('home')}
            //must only run 'home' when signin is called, so make onClick call a function 
            //onClick={() => onRouteChange('home')}  -> move up to onSubmitSignIn
            onClick={this.onSubmitSignIn}
            className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
            type="submit" 
            value="Sign in"
          />
        </div>
        <div className="lh-copy mt3">
          <p 
            onClick={() => onRouteChange('register')} 
            className="f6 link dim black db pointer">Register
          </p>
          {/*<a href="#0" className="f6 link dim black db">Forgot your password?</a>*/}
        </div>
        </div>
      </main>
      </article>
    );
  }
}

export default Signin;

