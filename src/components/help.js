import React, { Component, Fragment } from 'react';
import {
  withStyles,
  Card,
  CardContent,
  CardActions,
  Modal,
  Button,
  Typography,
  Grid
} from '@material-ui/core';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import ClearIcon from '@material-ui/icons/Clear';

const styles = theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    width: '90%',
    maxWidth: 600,
    height: '85%',
    overflowY: 'scroll',
  },
  modalCardContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  marginTop: {
    marginTop: theme.spacing(5),
  },
  textCenter: {
    margin: 'auto'
  },
  images: {
    width: '100%'
  },
  links: {
    textDecoration: 'none',
    color: 'black'
  },
  header: {
    marginTop: theme.spacing(2)
  }
});

class Help extends Component {
  constructor() {
    super()

    this.state = {
      showModal: false
    }

    this.handleChange = this.handleChange.bind(this)
  }

  componentDidUpdate() {
    if(this.state.showModal !== this.props.showModal) {
      this.setState({ showModal: this.props.showModal})
    }
  }
  
  handleChange() {
    let parentHandler= this.props.handleChange
    this.setState({
      showModal: !this.state.showModal
    }, parentHandler)
  }

  render() {
    const { classes } = this.props
    const APP_VERSION = process.env.REACT_APP_VERSION

    return (
      <Fragment>
      {this.state.showModal && (
        <Modal
          className={ classes.modal }
          onClose={ this.handleChange }
          open
        >
          <Card className={`${ classes.modalCard } ${ classes.marginTop }`}>
              <CardContent className={ classes.modalCardContent }>
                <Typography variant="h6">About the app</Typography>
                <Typography> Provides a simple and easy to use interface for the powerful pelias backend. </Typography>
                <Typography>Two types of queries are possible Forward and Reverse Query.</Typography>
                <Typography>App version: {APP_VERSION}</Typography>
                <Typography variant="h6">Forward</Typography>
                <Typography>Forward query the goal is to find the x and y coordinates of a given street. </Typography>
                <Typography variant="h6">Reverse</Typography>
                <Typography>Reverse query is the opposite where the goal is to find the address of given x and y coordinates.</Typography>

                <Typography className={ classes.header } variant="h6">Data sources and usage</Typography>
                <Typography>The geoencoding currently only supports queries within the countries Austria, Slowakia and Czech Republic.</Typography>
                <Typography>The geolocation data is based on an open data. Details can be found <a href="https://github.com/pelias/documentation/blob/master/data-sources.md" target="_blank">here</a>.</Typography>

                <Typography className={ classes.header } variant="h6">Developing Institute</Typography>
                <img className={ classes.images } src={`${window.location.origin}/images/fvv.png`} alt="FVV Research Department"/>

                <Typography variant="h6">Project team</Typography>
                <Grid container spacing={1}>
                  <Grid item xs={4} className={ classes.textCenter }>
                    <a href="https://www.linkedin.com/in/shibayama/" target="_blank" className={ classes.links }><Typography>Takeru Shibayama, Project Support</Typography></a>
                  </Grid>
                  <Grid item xs={8}>
                    <img className={ classes.images } src={`${window.location.origin}/images/team/shibayama.jpg`} alt="Takeru Shibayama"/>
                  </Grid>
                  <Grid item xs={4} className={ classes.textCenter }>
                    <a href="https://www.linkedin.com/in/tadej-brezina-057097b/" target="_blank" className={ classes.links }><Typography>Tadej Brezina, Project Project Coordination</Typography></a>
                  </Grid>
                  <Grid item xs={8}>
                    <img className={ classes.images } src={`${window.location.origin}/images/team/brezina.jpg`} alt="Tadej Brezina"/>
                  </Grid>
                  <Grid item xs={4} className={ classes.textCenter }>
                    <a href="https://levell.ch/" target="_blank" className={ classes.links }><Typography>James Levell, Developer</Typography></a>
                  </Grid>
                  <Grid item xs={8}>
                    <img className={ classes.images } src={`${window.location.origin}/images/team/levell.jpg`} alt="James Levell"/>
                  </Grid>
                </Grid>

                <Typography variant="h6" className={ classes.header}>Disclaimer</Typography>
                <Typography>This geoencoding tool is provided as is, and no support will be given. This geoencoding service uses the pelias backend and the encoding result depends on the data of <a href="https://github.com/pelias/documentation/blob/master/data-sources.md" target="_blank">opendata</a>. Querying a large amount of data within a very short time, for example by automated means, is prohibited. Technische Universität Wien (TU Wien hereafter) retains the right to block the use of this geoencoding tool if such a high-intensity request is detected. TU Wien, the developers and any other person assume no responsibility for the accuracy of the data. In no event shall TU Wien, the developers and any other person be liable to any person for any damage or loss that may arise from the use of this geoencoding tool. Please be aware that the use of this geoencoding tool will be deemed as agreeing to the terms of these conditions.</Typography>
              </CardContent>          
              <CardActions>
                <Button size="small" onClick={ this.handleChange }><ClearIcon/>Close</Button>
              </CardActions>
          </Card>
        </Modal>
      )}

      </Fragment>
    )
  }
}

export default compose(
  withRouter,
  withStyles(styles),
)(Help);