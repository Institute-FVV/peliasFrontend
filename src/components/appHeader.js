import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  withStyles,
  TextField
} from '@material-ui/core';
import MapIcon from '@material-ui/icons/Map';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { compose } from 'recompose';
import Help from './help'

const styles = theme => ({
  flex: {
    flex: 1,
  },
  headerButton: {
    position: 'absolute',
    bottom: theme.spacing(0),
    right: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      bottom: theme.spacing(-1.5),
      right: theme.spacing(2),
    },
  },
  text: {
    fontSize: '4.5em',
    color: 'white',
    position: 'absolute',
    bottom: theme.spacing(0),
    right: theme.spacing(0),
    [theme.breakpoints.down('xs')]: {
      bottom: theme.spacing(1.5),
      right: theme.spacing(0),
    },
  },
  toolBar: {
    padding: theme.spacing(1)
  },
  queryInput: {
    marginLeft: theme.spacing(30),
    backgroundColor: "white",
    width: theme.spacing(150),
    [theme.breakpoints.down('xs')]: {
      marginLeft: theme.spacing(1),
      width: theme.spacing(15)
    },
    [theme.breakpoints.down('sm')]: {
      marginLeft: theme.spacing(1),
      width: theme.spacing(50)
    }
  }
})

class AppHeader extends Component {
  constructor() {
    super()
    this.state = {
      query: ""
    }
  }
  
  handleSubmit = evt => {
    const { handleSubmit } = this.props
    evt.preventDefault()
    handleSubmit(this.state.query)
  }
  
  handleQueryChange = evt => {
    this.setState({
      query: evt.target.value
    })
  }

  renderHelp() {
    return <Help/>;
  }
  
  render(){
    const { classes, query } = this.props

    if(query && this.state.query === "") {
      // query prsent, but state not updated
      this.setState({ query: query})
    }

    return (
      <AppBar position="static">
        <Toolbar className={classes.toolBar}>
          <Button color="inherit" component={Link} to="/">
            <MapIcon/>
            <Typography variant="h6" color="inherit">
              Geoencoding 
            </Typography>
          </Button>


          <form onSubmit={this.handleSubmit}>
            <TextField
              required 
              type="text"
              key="inputQuery"
              placeholder="Gusshausstrasse 30"
              className={classes.queryInput}
              value={this.state.query}
              onChange={this.handleQueryChange}
              variant="outlined"
              size="small"
              autoFocus 
            />
          </form>

          <Button 
            component={Link}
            to="/help"
            className={classes.headerButton}
          >
            <HelpOutlineIcon 
              color="secondary"
              aria-label="add"
              className={classes.text}
            />
          </Button>
          <Route exact path="/help" render={this.renderHelp} />
        </Toolbar>
      </AppBar>
    )
  }
}

export default compose(
  withStyles(styles),
)(AppHeader);