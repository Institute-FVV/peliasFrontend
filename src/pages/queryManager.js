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
    width: "100%",
    [theme.breakpoints.down('lg')]: {
      width: theme.spacing(120)
    },
    [theme.breakpoints.down('md')]: {
      width: theme.spacing(80)
    },
    [theme.breakpoints.down('sm')]: {
      width: theme.spacing(30)
    },
    [theme.breakpoints.down('xs')]: {
      width: theme.spacing(20)
    },
  }
});

class QueryManager extends Component {
  constructor() {
    super();
    this.state = {
      query: "",
      result: "",

      loading: false,
      error: null,
    };
  }

  componentDidMount() {
    var query = this.props.match.params.query

    if(query && this.state.query !== query) {
      // query is set but does not match the information in the state
      this.setState({
        query: query
      }, this.executeQuery)
    } 
  }

  async fetch(method, endpoint, body) {
    this.setState({ loading: true })

    try {
      const response = await fetch(`${ pelias_url }search?text=${endpoint}`, {
        method,
        body: body && JSON.stringify(body),
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
        },
      });

      this.setState({ loading: false })
      return await response.json();
    } 
    catch (error) {
      console.error(error);
      this.setState({ 
        error: error,
        loading: false 
      });
    }
  }

  async executeQuery() {
    let result = (await this.fetch('get', this.state.query)) || [] 

    if(result.features.length === 0) {
      // no information could be returned by the endpoint
      this.setState({ 
        error: "For the given address no data could be queried"
      })
    }

    this.setState({ 
      result: result
    });
  }

  handleSubmit = evt => {
    const { history } = this.props;

    // push information into history, so exportable
    history.push("/query/" + this.state.query)
    
    evt.preventDefault()
    this.executeQuery()
  }
  
  handleQueryChange = evt => {
    this.setState({
      query: evt.target.value
    })
  }

  render() {
    const { classes } = this.props;

    // revert escaped slashes
    const readableQuery = this.state.query.replaceAll('%2F', '/')

    console.log(this.state)

    return (
      <Fragment>
        <form onSubmit={this.handleSubmit}>
          <TextField
            required 
            type="text"
            key="inputQuery"
            placeholder="Gusshausstrasse 30"
            className={ classes.queryInput }
            value={ this.state.query }
            onChange={ this.handleQueryChange }
            variant="outlined"
            size="small"
            autoFocus 
          />
        </form>
        {
          this.state.result !== "" ? (
            // result present
            this.state.result.features.length !== 0 ? (
            // endpoint provided information to present
            <Fragment>
              <Typography variant="h4" component="h2" gutterBottom> Result for { this.state.result.geocoding.query.text } </Typography>
              <TableContainer component={ Paper }>
                <Table className={ classes.table } aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={ 2 } className={ classes.headerTable }> Geometry </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell width={ "40%" }>X</TableCell>
                      <TableCell>{this.state.result.features[0].geometry.coordinates[0] }</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell width={ "40%" }>Y</TableCell>
                      <TableCell>{ this.state.result.features[0].geometry.coordinates[1] }</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
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
                      <TableCell width={ "40%" }>Neighbourhood</TableCell>
                      <TableCell>{ this.state.result.features[0].properties.neighbourhood }</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell width={ "40%" }>Region</TableCell>
                      <TableCell>{ this.state.result.features[0].properties.region }</TableCell>
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
                    <TableRow>
                      <TableCell width={ "40%" }>Parsed text - postal code</TableCell>
                      <TableCell>{ this.state.result.geocoding.query.parsed_text.postalcode }</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell width={ "40%" }>Parsed text - street</TableCell>
                      <TableCell>{ this.state.result.geocoding.query.parsed_text.street }</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell width={ "40%" }>Parsed text - housenumber</TableCell>
                      <TableCell>{ this.state.result.geocoding.query.parsed_text.housenumber }</TableCell>
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
)(QueryManager);