import React, { Fragment, Component } from 'react';
import { matchPath } from 'react-router'
import { withRouter, Route, Redirect } from 'react-router-dom';
import {
  CssBaseline,
  withStyles,
  Typography
} from '@material-ui/core';
import { compose } from 'recompose';

import AppHeader from './appHeader';
import QueryManager from '../pages/queryManager';

const styles = theme => ({
  main: {
    padding: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(1),
    },
  },
});

class App extends Component {
  constructor() {
    super()
    this.state = {
      query: ""
    }

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(query) {
    let tempQuery = query.replaceAll('/', '%2F')
    this.setState({ query: tempQuery})
  }

  render() {
    const match = matchPath(this.props.history.location.pathname, {
      path: '/query/:query',
      exact: true,
      strict: false
    })
    const { classes } = this.props

    if(match) {
      // parameters are present
      const query = match.params.query
      if(query && this.state.query === "") {
        // the query parameter is set and the current state unset
        this.setState({ query: query})
      }
    } else if(this.state.query) {
      // no parametres present but state has query, reset state query information
      this.setState({ query: ''})
    }  

    return (
      <Fragment>
        {this.state.query !== "" ? (
          // redirect to query
          <Redirect to={`/query/${this.state.query}`} />
        ) : (
          <Typography></Typography>
        )}

        <Fragment>
          <CssBaseline />
          <AppHeader query={this.state.query} handleSubmit={this.handleSubmit}/>
          <main className={classes.main}>
            <Route exact path="/" component={QueryManager} />
            <Route exact path="/query/:query" component={QueryManager} />
          </main>
      </Fragment>
    </Fragment>
    )
  }
}

export default compose(withRouter, withStyles(styles), )(App);