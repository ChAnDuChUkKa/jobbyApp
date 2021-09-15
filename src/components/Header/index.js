import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const onClickLogOut = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <nav className="header-container">
      <div className="nav-container">
        <Link to="/">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="logo"
          />
        </Link>
        <ul className="nav-items">
          <Link to="/">
            <li className="home">Home</li>
          </Link>
          <Link to="/jobs">
            <li className="jobs">Jobs</li>
          </Link>
          <li>
            <div className="button-container">
              <button type="button" onClick={onClickLogOut}>
                LogOut
              </button>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  )
}
export default withRouter(Header)
