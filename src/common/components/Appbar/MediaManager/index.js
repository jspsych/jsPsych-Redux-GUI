import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Dropzone from 'react-dropzone';
import { upload } from '../../../backend/s3';
// import TextField from 'material-ui/TextField';

import {
  grey800 as normalColor,
  cyan600 as iconHighlightColor,
  green500 as checkColor,
} from 'material-ui/styles/colors';
import MediaManagerIcon from 'material-ui/svg-icons/image/photo-library';

export default class jsPsychInitEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
			files: [],
    };

    this.handleOpen = () => {
      this.setState({
        open: true
      });
    };

    this.handleClose = () => {
      this.setState({
        open: false
      });
    };

		this.onDrop = (files) => {
			this.setState({files: files})
		}

		this.handleUpload = () => {
			console.log(this.state.files);
			//console.log(s3);
			upload(this.state.files);
		}
  }

  render() {
    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClose}
      />,
    ];

    return (
        <div className="mediaManager">
          <IconButton
              tooltip="Media Manager"
              onTouchTap={this.handleOpen}
          >
              <MediaManagerIcon
                color={(this.state.open) ? iconHighlightColor :normalColor}
                hoverColor={iconHighlightColor}
              />
          </IconButton>
          <Dialog
            contentStyle={{minHeight: 500}}
            title="Media Manager"
            actions={actions}
            modal={true}
            open={this.state.open}
            onRequestClose={this.handleClose}
            autoScrollBodyContent={true}
          >
						<Dropzone onDrop={this.onDrop.bind(this)}></Dropzone>
						<ul>
	            {
	              this.state.files.map(f => <li>{f.name} - {f.size} bytes</li>)
	            }
	          </ul>
						<FlatButton
			        label="Upload Files"
			        primary={true}
			        keyboardFocused={true}
			        onTouchTap={this.handleUpload}
			      />
          </Dialog>
        </div>
    )
  }
}
