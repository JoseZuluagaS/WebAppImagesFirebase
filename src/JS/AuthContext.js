import React, { Component } from 'react'
import {validateAuth,signOut} from './Services/firebase'

const AuthContext = React.createContext()

class AuthProvider extends Component {
  state = { isAuth: false }

  constructor() {
    super()
    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
  }

  componentDidMount(){
    validateAuth
    .then((user)=>{
        if(user!=null)
        this.setState({
          isAuth:true
      })
    })
  }

  login() {
    setTimeout(() => this.setState({ isAuth: true }), 1000)
  }

  logout() {
    signOut()
		.then(()=>{
			setTimeout(() => this.setState({ isAuth: false }), 1000)
		})  
  }

  render() {
    return (
      <AuthContext.Provider
        value={{
          isAuth: this.state.isAuth,
          login: this.login,
          logout: this.logout
        }}
      >
        {this.props.children}
      </AuthContext.Provider>
    )
  }
}

const AuthConsumer = AuthContext.Consumer

export { AuthProvider, AuthConsumer }
