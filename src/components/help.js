import React from 'react';
import {
  withStyles,
  Card,
  CardContent,
  CardActions,
  Modal,
  Button,
  Typography
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
    maxWidth: 500,
  },
  modalCardContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  marginTop: {
    marginTop: theme.spacing(10),
  },
});
const APP_VERSION = process.env.REACT_APP_VERSION

const Help = ({ classes, history }) => (
  <Modal
    className={ classes.modal }
    onClose={() => history.goBack() }
    open
  >
    <Card className={`${ classes.modalCard } ${ classes.marginTop }`}>
        <CardContent className={ classes.modalCardContent }>
          <Typography variant="h6">About the app</Typography>
          <Typography> Provides a simple and easy to use interface for the powerful pelias backend. </Typography>
          <Typography>Two types of queries are possible Forward and Reverse Query</Typography>
          <Typography>App version: {APP_VERSION}</Typography>
          <Typography variant="h6">Forward</Typography>
          <Typography>Forward query the goal is to find the x and y coordinates of a given street. </Typography>
          <Typography variant="h6">Reverse</Typography>
          <Typography>Reverse query is the opposite where the goal is to find the address of given x and y coordinates</Typography>
        </CardContent>          
        <CardActions>
          <Button size="small" onClick={() => history.goBack()}><ClearIcon/>Close</Button>
        </CardActions>
    </Card>
  </Modal>
);

export default compose(
  withRouter,
  withStyles(styles),
)(Help);