import React from 'react';
import Dialog from 'material-ui/Dialog';
import Subheader from 'material-ui/Subheader';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Dropzone from 'react-dropzone';
import LinearProgress from 'material-ui/LinearProgress';
const mime = require('mime-types');
import { List, ListItem } from 'material-ui/List';

import {
	grey800 as normalColor,
	cyan600 as iconHighlightColor,
	cyan500 as checkColor,
	blue800 as titleIconColor,
	indigo500 as hoverColor,
	cyan500 as iconColor,
	grey800 as previewIconColor,
	grey400
} from 'material-ui/styles/colors';
import Add from 'material-ui/svg-icons/av/library-add';
import Media from 'material-ui/svg-icons/action/shopping-cart';
import MediaManagerIcon from 'material-ui/svg-icons/image/photo-library';
import ImageIcon from 'material-ui/svg-icons/image/photo';
import MovieIcon from 'material-ui/svg-icons/image/movie-creation';
import AudioIcon from 'material-ui/svg-icons/image/audiotrack';
import FileIcon from 'material-ui/svg-icons/editor/insert-drive-file';
import PDFIcon from 'material-ui/svg-icons/image/picture-as-pdf';
import CheckNoIcon from 'material-ui/svg-icons/toggle/check-box-outline-blank';
import CheckYesIcon from 'material-ui/svg-icons/toggle/check-box';
import PreviewIcon from 'material-ui/svg-icons/image/remove-red-eye'

import { renderDialogTitle } from '../gadgets';
import Notification from '../../containers/Notification';
import { getSignedUrl } from '../../backend/s3';

import { AppbarIcon as AppbarIconStyle } from '../Appbar/theme.js';
import GeneralTheme from '../theme.js';

const colors = {
	...GeneralTheme.colors
}

var __DEBUG__ = false;

export function fileIconFromTitle(title, color=null) {
	const type = mime.lookup(title);
	if(type === false){
		return <FileIcon color={color} />
	} else if(type.indexOf('image') > -1){
		return <ImageIcon color={color} />
	} else if(type.indexOf('pdf') > -1){
		return <PDFIcon color={color} />
	} else if(type.indexOf('video') > -1){
		return <MovieIcon color={color} />
	} else if(type.indexOf('audio') > -1){
		return <AudioIcon color={color} />
	}
	return <FileIcon />
}

export const MediaManagerMode = {
	upload: 'Upload',
	select: 'Select',
	multiSelect: 'multi-Select'
}

const map2Bool = (files, selected) => files && files.map(f => selected.indexOf(f) > -1);

export default class MediaManager extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			open: false || __DEBUG__,
			files: [],
			dropzoneActive: false,
			selected: [],
			completed: {},
			previewFileUrl: null,
		};

		this.handleEnter = () => {
			this.setState({
				dropzoneActive: true
			});
		}

		this.handleExit = () => {
			this.setState({
				dropzoneActive: false
			});
		}

		this.progressHook = (filename, percent) => {
			let completed = this.state.completed;
			if (completed[filename] === undefined) {
				completed[filename] = 0;
			} else {
				completed[filename] = percent;
			}
			this.setState({
				completed: completed
			})
		}

		this.startProgress = (filename) => {
			let completed = this.state.completed;
			completed[filename] = 0;
			this.setState({
				completed: completed
			})
		}

		this.handleOpen = () => {
			this.props.checkBeforeOpen(() => {
				this.setState({
					open: true,
					dropzoneActive: false,
					selected: map2Bool(this.props.filenames, this.props.selected)
				});
			});
		};

		this.handleClose = () => {
			this.setState({
				open: false,
				dropzoneActive: false,
			});
		};

		this.onDrop = (files) => {
			this.setState({
				dropzoneActive: false
			});
			this.handleUpload(files);
		}

		this.handleSelect = (index) => {
			let selected = this.state.selected.slice();
			selected[index] = !selected[index];
			this.setState({
				selected: selected,
			});
		}

		this.handleUpload = (files) => {
			this.props.uploadFiles(files, (update) => {
				this.setState(update);
			},
			this.progressHook);
			this.resetSelect();
		}

		this.handleDelete = () => {
			this.props.deleteFiles(
				this.props.s3files.Contents.filter((item, i) => (this.state.selected[i])).map((item) => (item.Key)),
			);
			this.resetSelect();
		}

		this.insertFile = () => {
			this.props.insertCallback(this.state.selected, this.handleClose);
			this.resetSelect();
		}

		this.resetSelect = () => {
			this.setState({
				selected: map2Bool(this.props.filenames, this.props.selected) || []
			})
		}

		this.openPreviewWindow = (s3filePath) => {
			let url = null;
			try {
				url = getSignedUrl(s3filePath);
			} catch(e) {
				console.log(e);
			}
			this.setState({
				previewFileUrl: url,
				previewFileTitle: s3filePath.replace(this.props.s3files.Prefix, ''),
			})
		}

		this.closePreviewWindow = () => {
			this.setState({
				previewFileUrl: null,
				previewFileTitle: null,
			})
		}

		this.renderTrigger = () => {
			switch(this.props.mode) {
				case MediaManagerMode.select:
				case MediaManagerMode.multiSelect:
					return (
						<this.props.Trigger_insert onClick={this.handleOpen}/>
					);
				case MediaManagerMode.upload:
				default:
					return (
						<this.props.Trigger_upload onClick={this.handleOpen}/>
					);
			}
		}

		this.renderActions = () => {
			const deleteButton = (
				<FlatButton
					label="Delete"
					labelStyle={{textTransform: "none", color: GeneralTheme.colors.secondaryDeep}}
					onClick={this.handleDelete}
				/>
			);
			switch(this.props.mode) {
				case MediaManagerMode.select:
				case MediaManagerMode.multiSelect:
					return [
						<FlatButton
							label="Save"
							labelStyle={{textTransform: "none", color: GeneralTheme.colors.primaryDeep}}
							onClick={this.insertFile}
						/>,
						deleteButton
					];
				case MediaManagerMode.upload:
				default:
					return [
						deleteButton,
					]
				}
		}

		this.renderPreviewTag = () => {
			if (!this.state.previewFileTitle) return <div />;

			let type = mime.lookup(this.state.previewFileTitle);

			if(type.indexOf('image') > -1){
				return <embed type={type} src={this.state.previewFileUrl} />
			} else if(type.indexOf('video') > -1){
				return <video controls width="100%" height={350} style={{paddingTop: 20}}>
							<source src={this.state.previewFileUrl} type={type} />
						</video>
			} else if(type.indexOf('audio') > -1){
				return <audio controls>
							<source src={this.state.previewFileUrl} type={type} />
						</audio>
			} else {
				return (
					<div style={{fontSize: 18, paddingTop: "20%"}}>
						<p>{`Sorry, but file "${this.state.previewFileTitle}" is not supported for preview.`}</p>
						<p>You may download it for further operations.</p>
					</div>
				)
			}
		}
	}

	static defaultProps = {
		mode: MediaManagerMode.upload,
		parameterName: null,
		selected: [],
		Trigger_upload: ({onClick}) => (
			<IconButton
              tooltip="Upload Media"
              onClick={onClick}
          	>
              <MediaManagerIcon {...AppbarIconStyle}/>
          	</IconButton>
		),
		Trigger_insert: ({onClick}) => (
			<IconButton 
				onClick={onClick}
				tooltip="Insert Media"
			>
				<Add color='#4D4D4D' hoverColor={GeneralTheme.colors.secondary}/>
			</IconButton>
		)
	}

	

	render() {
		const overlayStyle = {
			position: 'absolute',
			top: 0,
			right: 0,
			left: 0,
			bottom: 0,
			background: 'rgba(0,0,0,0.5)',
			textAlign: 'center',
			color: '#fff',
			justifyContent: 'center',
			display: 'flex',
			flexDirection: 'center'
		}

		let mediaList = null;
		if (this.props.s3files && this.props.s3files.Contents) {
			mediaList = this.props.s3files.Contents.map((f, i) =>
				<div style={{display: 'flex', width: '100%'}} key={`${f.ETag}-container`}>
					<div style={{flexGrow: 1}} key={`${f.ETag}-item`}>
						<ListItem
							key={f.ETag}
							primaryText={f.Key.replace(this.props.s3files.Prefix, '')}
							leftIcon={fileIconFromTitle(f.Key)}
							onClick={() => {this.handleSelect(i)}}
							rightIcon={
								this.state.selected[i] ? 
									<CheckYesIcon color={GeneralTheme.colors.primary}/> : 
									<CheckNoIcon color={GeneralTheme.colors.primary}/>
							}
						/>
					</div>
					<IconButton
						key={`${f.ETag}-checker`}
						style={{flexBasis: '48px'}}
						onClick={() => { this.openPreviewWindow(f.Key); }}
						tooltip="Preview Media"
						>
						<PreviewIcon color={colors.primaryDeep} hoverColor={colors.secondaryDeep} />
					</IconButton>
				</div>
				)
		}

		let uploadList = null, completed = Object.keys(this.state.completed);
		if (completed.length > 0) {
			uploadList = completed.map((key) =>
				<div style={{display: 'flex'}} key={"uploading-container-"+key}>
					<ListItem
						key={"uploading-"+key}
						primaryText={key}
						disabled={true}
						leftIcon={fileIconFromTitle(key)}
						/>
					<div key={"uploading-progress-container"+key} 
						 style={{width: "100%", marign: 'auto', paddingTop: 22}}
					>
					<LinearProgress 
						mode="determinate" 
						key={"uploading-progress-"+key} 
						value={this.state.completed[key]} 
						color={colors.primary}
					/>
					</div>
					<ListItem
						key={"uploading-number-"+key}
						primaryText={this.state.completed[key]+"%"}
						disabled={true}
						/>
				</div>
			)
		}

	    return (
	        <div className="mediaManager">
	          {this.renderTrigger()}
	          <Dialog
	            bodyStyle={{minHeight: 400, maxHeight: 400}}
	            titleStyle={{padding: 5}}
	            title={renderDialogTitle(
							<Subheader style={{maxHeight: 48}}>
			      				<div style={{display: 'flex'}}>
									<div style={{paddingTop: 8, paddingRight: 10}}>
										{(this.props.mode === MediaManagerMode.upload) ?
											<MediaManagerIcon color={GeneralTheme.colors.primaryDeep} />:
											<Media color={GeneralTheme.colors.primaryDeep}/>
										}
									</div>
									<div style={{fontSize: 20,}}>
				      					{(this.props.mode === MediaManagerMode.upload) ?
				      					"Media Manager" :
				      					"Pick your resources"}
				      				</div>
			      				</div>
		      				</Subheader>,
							this.handleClose,
							null
				)}
	            actions={this.renderActions()}
	            modal={true}
	            open={this.state.open}
	            onRequestClose={this.handleClose}
	            autoScrollBodyContent={true}
	          >
				<Dropzone
					disableClick={true}
					onDrop={this.onDrop.bind(this)}
					onDragEnter={this.handleEnter}
					onDragLeave={this.handleExit}
					style={{width:"100%", minHeight: 400, display: 'flex', height: "100%", flexDirection: 'column'}}
					>
					<List>
						{mediaList}
						{uploadList}
					</List>
					{!this.state.dropzoneActive ?
						<div style={{width: "100%", display: 'flex', flexGrow: 1, flexDirection: 'column', justifyContent: 'center'}}>
							<p style={{fontSize: 24, color: grey400, alignSelf: 'center'}}>
								Drag and drop files here to upload!
							</p>
						</div> :
						null
					}
					{this.state.dropzoneActive && 
					<div style={overlayStyle}>
						<p style={{fontSize: 24, color: grey400, alignSelf: 'center'}}>
								Drop files...
						</p>
					</div>}
				</Dropzone>
	          </Dialog>

	          <Notification />

	          <Dialog
	          	open={this.state.previewFileUrl !== null}
	          	titleStyle={{padding: 0}}
	          	title={renderDialogTitle(
	          		<Subheader style={{maxHeight: 48}}>
	          			<div style={{display: 'flex'}}>
							<div style={{paddingTop: 8, paddingRight: 10}}>
								{fileIconFromTitle(this.state.previewFileTitle, previewIconColor)}
							</div>
							<div style={{fontSize: 20,}}>
	          					{this.state.previewFileTitle}
				      		</div>
			      		</div>
	          		</Subheader>,
	          		this.closePreviewWindow,
	          		null
	          	)}
	          	contentStyle={{width: "100%", height: "100%"}}
	          	onRequestClose={this.closePreviewWindow}
	          	bodyStyle={{minHeight: 400, maxHeight: 400}}
	          	autoScrollBodyContent={true}
	          	actions={[
	          		<FlatButton 
	          			label="Download"
	          			labelStyle={{textTransform: 'none', color: colors.primaryDeep}}
	          			keyboardFocused
	          			href={this.state.previewFileUrl}
	          		/>
	          	]}
	          	>
	          	<div style={{textAlign: 'center'}}> 
	          		{this.renderPreviewTag()}
	          	</div>
	          	</Dialog>
	        </div>
	    )
	  }
}

