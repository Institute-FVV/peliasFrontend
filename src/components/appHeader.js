import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  withStyles,
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
  link: {
    fontSize: '1.5em',
    color: 'white',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    textDecoration: 'none'
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
  }
})

class AppHeader extends Component {
  constructor() {
    super()

    this.state = {
      showHelp: false
    }

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange() {
    this.setState({
      showHelp: !this.state.showHelp
    })
  }
  
  render(){
    const { classes } = this.props

    return (
      <AppBar position="static">
        <Toolbar className={ classes.toolBar }>
          <Button color="inherit" component={Link} to="/">
            <MapIcon/>
            <Typography variant="h6" color="inherit">
              Geoencoding 
            </Typography>
          </Button>

          <Link className={ classes.link } to="/query">Forward</Link>
          <Link className={ classes.link } to="/reversequery">Reverse</Link>

          <Button 
            onClick={ this.handleChange }
            className={ classes.headerButton }
          >
            <HelpOutlineIcon 
              color="secondary"
              aria-label="add"
              className={ classes.text }
            />
          </Button>
          <Help handleChange={ this.handleChange } showModal={ this.state.showHelp }/>
        </Toolbar>
      </AppBar>
    )
  }
}

export default compose(
  withStyles(styles),
)(AppHeader);