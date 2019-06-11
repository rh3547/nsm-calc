import React from 'react'
import { Route, Link, withRouter } from 'react-router-dom'
import NSMCalc from '../NSMCalc/calc'
import About from '../about/about'
import './app.css';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      title: "NSM Calc"
    };
  }

  navigate(route, title) {
    this.props.history.push(route);
    this.setState({
      title: title
    });
  }

  render() {
    return (
      <div>
        <div className="main-header">
          <AppBar position="fixed">
            <Toolbar>
              <img src="/images/health-icon.png" alt="Health Logo" className="main-header-logo" onClick={() => this.navigate("/calc")} />
              <Typography variant="h6" className="main-header-title">
                NYU Risk Assessment
            </Typography>
              <Typography variant="h6" className="main-header-subtitle">
                {this.state.title}
            </Typography>
            </Toolbar>
          </AppBar>
        </div>

        <div className="main-sidebar">
          <div className="sidebar-tile pointer" style={{ backgroundImage: "url(/images/calc-image.png)" }} onClick={() => this.navigate("/", "NSM Calc")}><p>NSM Calc</p></div>
          <div className="sidebar-tile pointer" style={{ backgroundImage: "url(/images/pc-image.png)" }} onClick={() => this.navigate("/about", "About")}><p>View Website</p></div>
        </div>

        <div className="main-content">
          <main>
            <Route exact path="/" component={NSMCalc} />
            <Route exact path="/calc" component={NSMCalc} />
            <Route exact path="/about" component={About} />
          </main>
        </div>
      </div>
    );
  }
}

export default withRouter(App)
