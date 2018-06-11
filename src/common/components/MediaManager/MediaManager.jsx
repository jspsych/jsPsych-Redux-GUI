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
	grey400,
	grey400 as SelectedListItemColor,
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

import { DialogTitle } from '../gadgets';
import Notification from '../../containers/Notification';
import { getSignedUrl } from '../../backend/s3';
import { MediaPathTag } from '../../backend/deploy';

import { AppbarIcon as AppbarIconStyle } from '../Appbar/theme.js';

const colors = {
	...theme.colors
}

const cssStyle = {
	DropZone: {
		root: utils.prefixer({
			width: "100%",
			minHeight: 400,
			display: 'flex',
			height: "100%",
			flexDirection: 'column'
		}),
		overlay: utils.prefixer({
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
		}),
		background: utils.prefixer({
			width: "100%",
			display: 'flex',
			flexGrow: 1,
			flexDirection: 'column',
			justifyContent: 'center'
		}),
		tip: utils.prefixer({
			fontSize: 24,
			color: grey400,
			alignSelf: 'center'
		})
	}
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
			uploadingList: {},
			previewFileUrl: '',
			s3Files: {}
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
			let uploadingList = utils.deepCopy(this.state.uploadingList);
			if (uploadingList[filename] === undefined) {
				uploadingList[filename] = 0;
			} else {
				uploadingList[filename] = percent;
			}
			this.setState({
				uploadingList: uploadingList
			});
		}

		this.startProgress = (filename) => {
			let uploadingList = utils.deepCopy(this.state.uploadingList);
			uploadingList[filename] = 0;
			this.setState({
				uploadingList: uploadingList
			})
		}

		this.initLocalSelected = () => {
			let selected;
			if (Array.isArray(this.props.selected)) {
				selected = this.props.selected;
			} else {
				selected = [this.props.selected];
			}

			return this.props.mode === MediaManagerMode.upload ?
					this.props.filenames.map(f => false) :
					map2Bool(this.props.filenames, selected)
		}

		this.handleOpen = () => {
			this.props.checkBeforeOpen((canOpen) => {
				if (canOpen) {
					this.setState({
						open: true,
						dropzoneActive: false,
						selected: this.initLocalSelected()
					});
					return this.fetchS3Files();
				}
				return Promise.resolve();
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

		this.fetchS3Files = () => {
			return myaws.S3.listBucketContents({
				Prefix: [this.props.userId, this.props.experimentId].join(myaws.S3.Delimiter)
			}).then((data) => {
				this.setState({
					s3Files: data
				});
				return data;
			});
		}

		this.getS3FileNames = () => {
			let filenames = [], s3Files = this.state.s3Files;
			if (s3Files.Contents) {
				filenames = s3Files.Contents.map((f) => (f.Key.replace(s3Files.Prefix, '')));
			}
			return filenames;
		}

		this.handleUpload = (files) => {
			let { progressHook } = this;
			let { userId, experimentId } = this.props;

			this.props.uploadFiles({
				files,
				progressHook,
				userId,
				experimentId
			}).then(this.fetchS3Files)
		}

		this.handleDelete = () => {
			this.props.deleteFiles(
				this.props.s3files.Contents.filter((item, i) => (this.state.selected[i])).map((item) => (item.Key)),
			);
			this.resetSelect();
		}

		this.insertFile = () => {
			let value = [];
			for (let i = 0; i < this.state.selected.length; i++) {
				if (this.state.selected[i]) {
					value.push(MediaPathTag(this.props.filenames[i]));
				}
			}
			if (value.length > 1 && this.props.mode !== MediaManagerMode.multiSelect) {
				this.props.notifyWarningByDialog("You can insert only one file here !");
				return;
			}
			this.props.onCommit(value);
			if (value.length > 0) {
				this.props.notifySuccessBySnackbar("Media Inserted !");
			} else {
				this.props.notifyWarningBySnackbar("None Selected !");
			}
			this.resetSelect();
			this.handleClose();
		}

		this.resetSelect = () => {
			this.setState({
				selected: this.initLocalSelected()
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
					labelStyle={{textTransform: "none", color: theme.colors.secondaryDeep}}
					onClick={this.handleDelete}
				/>
			);
			switch(this.props.mode) {
				case MediaManagerMode.select:
				case MediaManagerMode.multiSelect:
					return [
						<FlatButton
							label="Insert"
							labelStyle={{textTransform: "none", color: theme.colors.primaryDeep}}
							onClick={this.insertFile}
						/>,
						// deleteButton
					];
				case MediaManagerMode.upload:
				default:
					return [
						deleteButton,
					]
				}
		}

		this.renderPreviewTag = () => {
			let { previewFileTitle, previewFileUrl } = this.state;
			if (!previewFileTitle) {
				return null;
			}

			let type = mime.lookup(previewFileTitle);

			if(type.indexOf('image') > -1){
				return (
					<embed type={type} src={previewFileUrl} />
				);
			} else if(type.indexOf('video') > -1){
				return (
					<video controls width="100%" height={350} style={utils.prefixer({paddingTop: 20})}>
						<source src={previewFileUrl} type={type} />
					</video>
				);
			} else if(type.indexOf('audio') > -1){
				return (
					<audio controls>
						<source src={previewFileUrl} type={type} />
					</audio>
				);
			} else {
				return (
					<div style={utils.prefixer({fontSize: 18, paddingTop: "20%"})}>
						<p>{`Sorry, but file "${previewFileTitle}" is not supported for preview.`}</p>
						<p>You may download it for further operations.</p>
					</div>
				);
			}
		}
	}

	static defaultProps = {
		mode: MediaManagerMode.upload,
		parameterName: null,
		selected: [],
		onCommit: (value) => {},
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
				<Add color='#4D4D4D' hoverColor={theme.colors.secondary}/>
			</IconButton>
		)
	}

	render() {
		let Media_List = null;
		if (this.props.s3files && this.props.s3files.Contents) {
			Media_List = this.props.s3files.Contents.map((f, i) => {
				let fname = f.Key.replace(this.props.s3files.Prefix, '');
				return (
					<div style={{
							display: 'flex', 
							width: '100%',
						}} key={`${f.ETag}-container`}>
						<div style={{flexGrow: 1}} key={`${f.ETag}-item`}>
							<ListItem
								key={f.ETag}
								primaryText={fname}
								style={{
									backgroundColor: (this.props.mode === MediaManagerMode.upload && this.state.selected[i]) ? SelectedListItemColor : null
								}}
								leftIcon={fileIconFromTitle(f.Key, this.state.selected[i] ? colors.primary : null)}
								onClick={() => {this.handleSelect(i)}}
								rightIcon={
									this.props.mode !== MediaManagerMode.upload ?
									(this.state.selected[i] ? 
										<CheckYesIcon color={theme.colors.primary}/> : 
										<CheckNoIcon color={theme.colors.primary}/>) :
									null
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
				)}
			)
		}

		let uploadList = null, uploadingList = Object.keys(this.state.uploadingList);
		if (uploadingList.length > 0) {
			uploadList = uploadingList.map((key) =>
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
						value={this.state.uploadingList[key]} 
						color={colors.primary}
					/>
					</div>
					<ListItem
						key={"uploading-number-"+key}
						primaryText={this.state.uploadingList[key]+"%"}
						disabled={true}
						/>
				</div>
			)
		}

	    return (
	        <div>
	          {this.renderTrigger()}
	          <Dialog
	            open={this.state.open}
	            modal
	            autoScrollBodyContent
	            bodyStyle={utils.prefixer({minHeight: 400, maxHeight: 400})}
	            titleStyle={utils.prefixer({padding: 5})}
	            title={
	            	<DialogTitle
	            		node={
	            			<Subheader style={utils.prefixer({maxHeight: 48})}>
			      				<div style={utils.prefixer({display: 'flex'})}>
									<div style={utils.prefixer({paddingTop: 8, paddingRight: 10})}>
										{(this.props.mode === MediaManagerMode.upload) ?
											<MediaManagerIcon color={theme.colors.primaryDeep} />:
											<Media color={theme.colors.primaryDeep}/>
										}
									</div>
									<div style={utils.prefixer({fontSize: 20,})}>
				      					{(this.props.mode === MediaManagerMode.upload) ?
				      					"Media Manager" :
				      					"Pick your resources"}
				      				</div>
			      				</div>
		      				</Subheader>
	            		}
	            		closeCallback={this.handleClose}
	            	/>
	            }
	            actions={this.renderActions()}
	          >
				<Dropzone
					disableClick={true}
					onDrop={this.onDrop.bind(this)}
					onDragEnter={this.handleEnter}
					onDragLeave={this.handleExit}
					style={{...cssStyle.DropZone.root}}
					>
					<List>
						{Media_List}
						{uploadList}
					</List>
					{!this.state.dropzoneActive && this.props.mode === MediaManagerMode.upload &&
						<div style={{...cssStyle.DropZone.background}}>
							<p style={{...cssStyle.DropZone.tip}}>
								Drag and drop files here to upload!
							</p>
						</div>
					}
					{
					this.state.dropzoneActive && this.props.mode === MediaManagerMode.upload && 
					<div style={{...cssStyle.DropZone.overlay}}>
						<p style={{...cssStyle.DropZone.tip}}>
								Drop files...
						</p>
					</div>
					}
				</Dropzone>
	          </Dialog>

	          <Dialog
	          	open={!!this.state.previewFileUrl}
	          	autoScrollBodyContent
	          	titleStyle={utils.prefixer({padding: 0})}
	          	contentStyle={utils.prefixer({width: "100%", height: "100%"})}
	          	bodyStyle={utils.prefixer({minHeight: 400, maxHeight: 400})}
	          	title={
	          		<DialogTitle
	          			node={
	          				<Subheader style={utils.prefixer({maxHeight: 48})}>
			          			<div style={utils.prefixer({display: 'flex'})}>
									<div style={utils.prefixer({paddingTop: 8, paddingRight: 10})}>
										{fileIconFromTitle(this.state.previewFileTitle, previewIconColor)}
									</div>
									<div style={utils.prefixer({fontSize: 20,})}>
			          					{this.state.previewFileTitle}
						      		</div>
					      		</div>
			          		</Subheader>
	          			}
	          			closeCallback={this.closePreviewWindow}
	          		/>
	          	}
	          	onRequestClose={this.closePreviewWindow}
	          	actions={[
	          		<FlatButton 
	          			label="Download"
	          			labelStyle={{textTransform: 'none', color: colors.primaryDeep}}
	          			keyboardFocused
	          			href={this.state.previewFileUrl}
	          		/>
	          	]}
	          	>
		          	<div style={utils.prefixer({textAlign: 'center'})}> 
		          		{this.renderPreviewTag()}
		          	</div>
	          	</Dialog>
	     </div>
	    );
	  }
}

