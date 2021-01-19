import React, { Fragment, Component } from 'react';
import { withRouter, Route } from 'react-router-dom';
import {
  CssBaseline,
  withStyles
} from '@material-ui/core';
import { compose } from 'recompose';

import AppHeader from './appHeader';
import QueryManager from '../pages/queryManager';
import ReverseQueryManager from '../pages/reverseQueryManager';

const styles = theme => ({
  main: {
    padding: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(1),
    },
  },
});

class App extends Component {
  render() {
    const { classes } = this.props

    return (
        <Fragment>
          <CssBaseline />
          <AppHeader/>
          <main className={ classes.main }>
            <Route exact path="/" component={ QueryManager } />
            <Route exact path="/query" component={ QueryManager } />
            <Route exact path="/reversequery" component={ ReverseQueryManager } />
            <Route exact path="/query/:query" component={ QueryManager } />
            <Route exact path="/reversequery/:query" component={ReverseQueryManager } />
          </main>
      </Fragment>
    )
  }
}

export default compose(withRouter, withStyles(styles), )(App);