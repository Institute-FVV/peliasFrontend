import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import {
  withStyles,
  Typography,
  Button,
  Select,
  InputLabel,
  MenuItem
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { compose } from 'recompose';

import LoadingBar from '../components/loadingBar';
import ErrorSnackbar from '../components/errorSnackbar';
import InfoSnackbar from '../components/infoSnackbar'

const styles = theme => ({
  form: {
    marginTop: theme.spacing(4)
  },
  inputLabel: {
    marginTop: theme.spacing(4)
  }
});
const queryTypes = ["Forward", "Reverse"]      // language definition for dropdown

class FileUpload extends Component {
  constructor() {
    super();

    this.state = {      
        document: '',
        queryType: "Forward",
        inputFileKey: Date.now(),         // after the successfull upload of a document we have to reiinitialize the input field

        loading: true,                   // flag for displaying loading bar
        success: null,                   // flag for displaying success messages
        error: null,                   // flag for displaying error messages
      };

      this.onFileChange = this.onFileChange.bind(this);
      this.handleQueryTypeChange = this.handleQueryTypeChange.bind(this)
      this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.setState({
      loading: false
    })
  }

  async fetch(method, endpoint, body) {
    try {
      this.setState({
        loading: true,
      })

      const response = await fetch(`/api${ endpoint }`, {
        method,
        headers: {
          "type": "formData"
        },
        body: body
      });

      this.setState({
        loading: false
      })

      if(response.ok === false) {
        console.error(response)
        this.setState({
          error: { message: "Error when uploading the document, please check the .csv format and try again"}
        })

        return response
      } else {
        // api returns result as csv, have to quickly store it as blb
        const blob = await response.blob();
        const newBlob = new Blob(["\ufeff", blob]);
        const blobUrl = window.URL.createObjectURL(newBlob);
    
        // execute click on blob to download i 
        const link = document.createElement('a');
        link.href = blobUrl;
        link.setAttribute('download', `${this.state.document.name}_result.csv`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(blob);
      }
    } catch (error) {
      console.error(error);
      this.setState({ 
        error: error 
      });
    }
  }

  onFileChange(evt) {
      this.setState({ 
        document: evt.target.files[0] 
      })
  }

  handleQueryTypeChange(evt) {
    this.setState({ queryType: evt.target.value })
  }

  async onSubmit(evt) {
      evt.preventDefault()
      const formData = new FormData()

      // combine file input and input field
      formData.append('document', this.state.document)
      formData.append('queryType', this.state.queryType)

      await this.fetch('post', "/upload", formData)

      this.setState({
        document: null,
        inputFileKey: Date.now()    // reset the input key so that the input field is regenerated (reset)
      })

      if(this.state.error === null) {
        this.setState({
          success: "Document uploaded successfully, initiated download of result csv"
        })
      }
  }  

  render() {
    const { classes } = this.props;
    
    return (
      <Fragment>
        <Typography variant="h4">CSV Upload</Typography>
        <Typography> Example File forward <a target="_blank" href={`${window.location.origin}/public/ExampleCSV_forward.csv`}>ExampleCSV_forward.csv</a></Typography>
        <Typography> Example File reverse <a target="_blank" href={`${window.location.origin}/public/ExampleCSV_reverse.csv`}>ExampleCSV_reverse.csv</a></Typography>
        
        <form encType="multipart/form-data" className={ classes.form } onSubmit={ this.onSubmit }>
          <label htmlFor="btn-upload">
            <input
              id="btn-upload"
              key={ this.state.inputFileKey }
              name="btn-upload"
              style={ { display: 'none' } }
              accept=".csv"
              type="file"
              onChange={ this.onFileChange } 
            />

            <Button
              color="primary"
              className="btn-choose"
              variant="outlined"
              component="span" 
            >
              Choose File
            </Button>
        </label>

        <InputLabel id="labelInputQueryType" className={ classes.inputLabel }>Query Type</InputLabel>
        <Select
          labelId="labelInputQueryType"
          id="inputQueryType"
          value={ this.state.queryType }
          onChange={ this.handleQueryTypeChange }
          required
        >
          {
            queryTypes.map((queryType, i) => (
              <MenuItem key={ i } value={ queryType }><em>{ queryType }</em></MenuItem>
            ))
          }
        </Select>

        <div className="file-name">
          { /* show upload button and filename only if file has been selected*/}
          { this.state.document && this.state.document.name.length > 0 && (
            <Typography className={ classes.inputLabel }>File: { this.state.document.name }</Typography>
          )}
        </div>
          
          <Button
            color="primary" 
            variant="outlined"
            disabled={ !this.state.document } 
            className={ classes.inputLabel }
            type="submit"
          >
            <AddIcon/>Upload
          </Button>
        </form>

        { /* Flag based display of error snackbar */ }
        {this.state.error && (
        <ErrorSnackbar
          onClose={() => this.setState({ error: null })}
          message={ this.state.error.message }
        />
        )}

        { /* Flag based display of loadingbar */ }
        {this.state.loading && (
          <LoadingBar/>
        )}

        { /* Flag based display of info snackbar */ }
        {this.state.success && (
          <InfoSnackbar
            onClose={() => this.setState({ success: null })}
            message={ this.state.success }
          />
        )}
      </Fragment>
    )
  }
}

export default compose(
    withRouter,
    withStyles(styles),
  )(FileUpload);