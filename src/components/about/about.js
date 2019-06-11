import React from 'react'
import { Route, Link, withRouter } from 'react-router-dom'
import './about.css';

class About extends React.Component {

  constructor(props) {
    super(props);
  }

  navigate(route) {
    // push(route);
    this.props.history.push(route);
  }

  render() {
    return (
      <div className="page-wrapper">
        <p>About Page!</p>
      </div>
    );
  }
}

export default withRouter(About)
