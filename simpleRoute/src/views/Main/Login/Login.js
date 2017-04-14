import React, { PropTypes as T } from 'react'
import {Button} from 'react-bootstrap'
import AuthService from '../../../utils/AuthService'
import { Jumbotron } from 'react-bootstrap'
import styles from './styles.module.css'

export class Login extends React.Component {
  static contextTypes = {
    router: T.object
  }

  static propTypes = {
    location: T.object,
    auth: T.instanceOf(AuthService)
  }

  render() {
    const { auth } = this.props
    return (
      <div className="App">
           <div className="App-header">
              <h2>Welcome to Simple Route</h2>
              <p>The quickest way is not always the simplest way!</p>
           </div>
          <Jumbotron>
            <h2 className={styles.mainTitle}>
                  <img src={require("../../../../assets/images/simpleroute.png")} alt="simpleRoute" width="204" height="166" />
                </h2>
            <div className={styles.root}>
              <h2>Login</h2>
                <Button bsStyle="primary" onClick={auth.login.bind(this)}>Login</Button>
            </div>
          </Jumbotron>
      </div>
    )
  }
}

export default Login;
