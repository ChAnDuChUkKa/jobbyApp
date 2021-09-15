import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class LoginForm extends Component {
  state = {username: '', password: '', showSubmitError: false, errorMessage: ''}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  submitSuccessView = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  submitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMessage: errorMsg})
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      this.submitSuccessView(data.jwt_token)
    } else {
      this.submitFailure(data.error_msg)
    }
  }

  render() {
    const {username, password, showSubmitError, errorMessage} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="app-container">
        <form className="login-container" onSubmit={this.submitForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo"
          />
          <label htmlFor="username" className="user">
            USERNAME
          </label>
          <input
            type="text"
            id="username"
            onChange={this.onChangeUsername}
            value={username}
            className="input-user"
            placeholder="Username"
          />
          <label htmlFor="password" className="user">
            PASSWORD
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={this.onChangePassword}
            placeholder="Password"
            className="input-user"
          />
          <button type="submit" className="button">
            LogIn
          </button>
          {showSubmitError && <p className="message">{errorMessage}</p>}
        </form>
      </div>
    )
  }
}
export default LoginForm
