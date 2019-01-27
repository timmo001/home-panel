// eslint-disable-next-line
import React from 'react';
import request from 'superagent';
import PropTypes from 'prop-types';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import SearchIcon from '@material-ui/icons/Search';

var searchTimeout;

class InputDialog extends React.PureComponent {
  radioGroup = null;
  state = {
    search: '',
    sources: [],
  };

  componentDidMount = () => this.updateProps();

  componentDidUpdate = (prevProps) => prevProps.value !== this.props.value && this.updateProps();

  updateProps = () => this.setState({ value: this.props.value });

  handleEntering = () => this.radioGroup.focus();

  handleCancel = () => this.props.handleChange(this.props.value);

  handleOk = () => this.props.handleChange(this.state.sources.find((source) =>
    source.guide_id === this.state.value
  ));

  handleChange = (_event, value) => this.setState({ value });

  handleSearch = () => {
    console.log('search:', this.state.search);
    request
      .post(`${this.props.apiUrl}/radio/search`)
      .send({ query: this.state.search })
      .set('Accept', 'application/json')
      .then(res => {
        this.setState({ sources: res.body.slice(0, 100) });
      })
      .catch(err => {
        console.error(err);
      });
  };

  handleSearchChange = search => this.setState({ search });

  render() {
    const { fullScreen, open } = this.props;
    const { sources } = this.state;

    return (
      <Dialog
        fullScreen={fullScreen}
        open={open}
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="xs"
        onEntering={this.handleEntering}
        aria-labelledby="confirmation-dialog-title">
        <DialogTitle id="confirmation-dialog-title">Select Source</DialogTitle>
        <DialogContent>
          <form noValidate autoComplete="off">
            <FormControl style={{ width: '100%' }} >
              <InputLabel htmlFor="search">Search Radio Stations..</InputLabel>
              <Input
                id="search"
                type="text"
                value={this.state.search}
                onChange={(event) => {
                  this.handleSearchChange(event.target.value);
                  clearTimeout(searchTimeout);
                  searchTimeout = setTimeout(() => {
                    this.handleSearch();
                  }, 1000)
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Search Stations"
                      onClick={this.handleSearch}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                } />
            </FormControl>
          </form>
          <RadioGroup
            ref={node => {
              this.radioGroup = node;
            }}
            aria-label="Ringtone"
            name="ringtone"
            value={this.state.value}
            onChange={this.handleChange}>
            {sources.map(source => (
              <FormControlLabel
                value={source.guide_id}
                key={source.guide_id}
                control={<Radio />}
                label={source.text} />
            ))}
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleOk} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

InputDialog.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
  open: PropTypes.bool.isRequired,
  apiUrl: PropTypes.string.isRequired,
  value: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
};

export default withMobileDialog()(InputDialog);