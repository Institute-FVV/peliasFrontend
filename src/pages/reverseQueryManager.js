import React, { Component, Fragment } from 'react';
import { withRouter} from 'react-router-dom';
import {
  withStyles,
  Typography,
  Table, 
  Paper,
  TableRow, 
  TableCell,
  TableHead,
  TableContainer,
  TableBody,
  TextField
} from '@material-ui/core';
import { compose } from 'recompose';

import LoadingBar from '../components/loadingBar'
import ErrorSnackbar from '../components/errorSnackbar';
import { pelias_url } from '../components/config';

const styles = theme => ({
  table: {
    minWidth: 700,
  },
  headerTable: {
    fontSize: "20px",
    width: "40%"
  },
  queryInput: {
    marginLeft: theme.spacing(1),
    backgroundColor: "white",
    width: theme.spacing(40),
    [theme.breakpoints.down('sm')]: {
      width: theme.spacing(20)
    },
    [theme.breakpoints.down('xs')]: {
      width: theme.spacing(10)
    },
  },
  submitButton: {
    visibility: 'hidden'
  }
});

class ReverseQueryManager extends Component {
  constructor() {
    super();
    this.state = {
      query_x: "",
      query_y: "",
      result: "",

      loading: false,
      error: null,
    };
  }

  componentDidMount() {
    // extract get from search parameters from url
    const search = window.location.search;
    const params = new URLSearchParams(search);
    
    if(params.get('point.lon')) {
      // paremters present
      var query_x = params.get('point.lon')
      var query_y =params.get('point.lat')

      if(this.state.query_x !== query_x || this.state.query_y !== query_y) {
        // query is set but does not match the information in the state
        this.setState({
          query_x: query_x,
          query_y: query_y
        }, this.executeQuery)
      }
    } 
  }

  async fetch(method, endpoint, body) {
    this.setState({ loading: true })

    try {
      const response = await fetch(`${pelias_url}reverse?${ endpoint }`, {
        method,
        body: body && JSON.stringify(body),
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
        },
      });

      this.setState({ loading: false })
      return await response.json();
    } catch (error) {
      console.error(error);
      this.setState({ 
        error: error,
        loading: false
       });
    }
  }

  async executeQuery() {
    // build url for get request, execute it
    let query = "point.lon=" + this.state.query_x + "&point.lat=" + this.state.query_y
    let result = (await this.fetch('get', query)) || [] 

    if(result.features.length === 0) {
      // no information could be returned by the endpoint
      this.setState({ 
        error: "for the given coordinates no data could be queried",
      })
    }

    this.setState({ 
      result: result
    });
  }

  handleSubmit = evt => {
    const { history } = this.props;

    // push information into history, so exportable    
    history.push("/reversequery/?point.lon=" + this.state.query_x + "&point.lat=" + this.state.query_y)
    
    evt.preventDefault()
    this.executeQuery()
  }

  handleQueryChange = evt => {
    this.setState({
      [evt.target.name]: evt.target.value
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <Fragment>
        <form onSubmit={ this.handleSubmit }>
          <TextField
            required 
            type="text"
            key="query_x"
            name="query_x"
            placeholder="X.x"
            className={ classes.queryInput }
            value={ this.state.query_x }
            onChange={ this.handleQueryChange }
            variant="outlined"
            size="small"
            autoFocus 
          />
          <TextField
            required 
            type="text"
            key="query_y"
            name="query_y"
            placeholder="Y.y"
            className={ classes.queryInput }
            value={ this.state.query_y }
            onChange={ this.handleQueryChange }
            variant="outlined"
            size="small"
            autoFocus 
          />

           <button className={ classes.submitButton } type="submit">Submit</button>
        </form>
        {
          this.state.result !== "" ? (
            // result present
            this.state.result.features.length !== 0 ? (
              
            // endpoint provided information to present
            <Fragment>
              <Typography variant="h4" component="h2" gutterBottom> Result for point.lon { this.state.result.geocoding.query["point.lon"] } and point.lat { this.state.result.geocoding.query["point.lat"] } </Typography>
              <TableContainer component={Paper}>
                <Table className={ classes.table } aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={ 2 } className={ classes.headerTable }> Properties </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell width={ "40%" }>Postalcode</TableCell>
                      <TableCell>{ this.state.result.features[0].properties.postalcode }</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell width={ "40%" }>Country</TableCell>
                      <TableCell>{ this.state.result.features[0].properties.country }</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell width={ "40%" }>Country Code</TableCell>
                      <TableCell>{ this.state.result.features[0].properties.country_a }</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell width={ "40%" }>Name</TableCell>
                      <TableCell>{ this.state.result.features[0].properties.name }</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell width={ "40%" }>Street</TableCell>
                      <TableCell>{ this.state.result.features[0].properties.street }</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell width={" 40%" }>Neighbourhood</TableCell>
                      <TableCell>{ this.state.result.features[0].properties.neighbourhood }</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell width={"40%"}>Region</TableCell>
                      <TableCell>{ this.state.result.features[0].properties.region}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <TableContainer component={ Paper }>
                <Table className={ classes.table } aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={ 2 } className={ classes.headerTable }> Pelias Metadata </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell width={ "40%" }>Confidence</TableCell>
                      <TableCell>{ this.state.result.features[0].properties.confidence }</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Fragment>
           ) : (
             // for the given address no detailed could be found by the api, display error message
             this.state.error ? (
              <ErrorSnackbar
                onClose={() => this.setState({ error: null })}
                message={ this.state.error }
              />
             ) : ( <div></div>)
           )
        ) : this.state.loading ? (
          // results are still loading...
          <LoadingBar/>
        ) : (
          // no query provided
          <div></div>
        )}
      </Fragment>
    );
  }
}

export default compose(
  withRouter,
  withStyles(styles),
)(ReverseQueryManager);