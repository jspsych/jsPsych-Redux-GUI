import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Checkbox from 'material-ui/Checkbox';
import Dropzone from 'react-dropzone';
import CircularProgress from 'material-ui/CircularProgress';
const mime = require('mime-types');
import {List, ListItem} from 'material-ui/List';
import { upload, deleteObjects, listBucketContents } from '../../../backend/s3';
// import TextField from 'material-ui/TextField';

import {
  grey800 as normalColor,
  cyan600 as iconHighlightColor,
  green500 as checkColor,
} from 'material-ui/styles/colors';
import MediaManagerIcon from 'material-ui/svg-icons/image/photo-library';
import ImageIcon from 'material-ui/svg-icons/image/photo';
import MovieIcon from 'material-ui/svg-icons/image/movie-creation';
import AudioIcon from 'material-ui/svg-icons/image/audiotrack';
import FileIcon from 'material-ui/svg-icons/editor/insert-drive-file';
import PDFIcon from 'material-ui/svg-icons/image/picture-as-pdf';
import CheckNoIcon from 'material-ui/svg-icons/toggle/check-box-outline-blank';
import CheckYesIcon from 'material-ui/svg-icons/toggle/check-box';

function fileIconFromTitle(title) {
	const type = mime.lookup(title);
	if(type == false){
		return <FileIcon />
	} else if(type.indexOf('image') > -1){
		return <ImageIcon />
	} else if(type.indexOf('pdf') > -1){
		return <PDFIcon />
	} else if(type.indexOf('video') > -1){
		return <MovieIcon />
	} else if(type.indexOf('audio') > -1){
		return <AudioIcon />
	}
	return <FileIcon />
}

export default class MediaManager extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
			files: [],
			s3files: {},
			dropzoneActive: false,
			uploadComplete: true,
			selected: []
    };

		this.handleEnter = () => {
			this.setState({dropzoneActive: true});
		}

		this.handleExit = () => {
			console.log('exit dropzone');
			this.setState({dropzoneActive: false});
		}

    this.handleOpen = () => {
			this.updateList();
      this.setState({
        open: true,
				dropzoneActive: false,
      });
    };

    this.handleClose = () => {
      this.setState({
        open: false,
				dropzoneActive: false,
      });
    };

		this.onDrop = (files) => {
			this.setState({dropzoneActive: false});
			this.handleUpload(files)
		}

		this.handleSelect = (i) => {
			let selected = this.state.selected;
			selected[i] = !selected[i];
			this.setState({selected: selected});
		}

		this.handleUpload = (files) => {
			//console.log(s3);
			this.setState({uploadComplete: false});
			upload(files,
			() => {
				this.setState({uploadComplete: true});
				this.updateList();
			});
		}

		this.handleDelete = () => {
			var keys = [];
			for(var i=0;i<this.state.selected.length;i++){
				if(this.state.selected[i]){
					keys.push(this.state.s3files.Contents[i].Key)
				}
			}
			deleteObjects(keys,
				() => {
					this.updateList();
				},
				() => {}
			)
		}

		this.updateList = () => {
			listBucketContents(
				(data) => {
					let selected = [];
					for(var i=0; i<data.Contents.length; i++){
						selected.push(false);
					}
					this.setState({
						s3files: data,
						selected: selected,
					});
					console.log('files updated!')
				},
				(err) => {},
			)
		}
  }

  render() {
    const actions = [
			<FlatButton
				label="Delete Selected Items"
				onTouchTap={this.handleDelete}
			/>,
      <FlatButton
        label="Close"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClose}
      />,
    ];

		const overlayStyle = {
			position: 'absolute',
			top: 0,
			right: 0,
			left: 0,
			bottom: 0,
			background: 'rgba(0,0,0,0.5)',
			textAlign: 'center',
			color: '#fff'
		}

		let mediaList = null;
		if(typeof this.state.s3files.Contents !== 'undefined'){
			mediaList = this.state.s3files.Contents.map( (f, i) =>
				<ListItem
					key={f.ETag}
					primaryText={f.Key}
					leftIcon={fileIconFromTitle(f.Key)}
					rightIconButton={
						<IconButton
							onTouchTap={() => {this.handleSelect(i)}}
							>
							{this.state.selected[i] ? <CheckYesIcon /> : <CheckNoIcon />}
						</IconButton>}
				/>)
		}

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
						<Dropzone
							disableClick
							onDrop={this.onDrop.bind(this)}
							onDragEnter={this.handleEnter}
							onDragLeave={this.handleExit}
							style={{width:"100%", minHeight: '200px', position: 'relative'}}>
							{this.state.uploadComplete && <List>{mediaList}</List>}
							{!this.state.uploadComplete && <CircularProgress size={80} thickness={5} />}
							{this.state.dropzoneActive && <div style={overlayStyle}>Drop files...</div>}
						</Dropzone>
          </Dialog>
        </div>
    )
  }
}
