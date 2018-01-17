import React from 'react';

import PreviewWindow from '../containers/PreviewWindow';
import ZoomBar from './PreviewWindow/ZoomBar';
import Appbar from '../containers/Appbar';
import TimelineNodeOrganizer from '../containers/TimelineNodeOrganizer';
import TimelineNodeEditor from '../containers/TimelineNodeEditor';

import { getFullScreenState } from './PreviewWindow';
import Notification from '../containers/Notification';
import { WIDTH as DEFAULT_TIMELINE_EDITOR_WIDTH } from './TimelineNodeEditor';
import { WIDTH as DEFAULT_TIMELINE_ORGANIZER_WIDTH } from './TimelineNodeOrganizer';

import GeneralTheme from './theme.js';

const colors = GeneralTheme.colors;

const style = {
	App: {
		width: '100%',
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
	},
	AppbarContainer: {
		flexBasis: '56px',
		maxHeight: '56px',
	},
	AppMainContainer: {
		flexGrow: '1',
		width: '100%',
		height: '100%',
		display: 'flex',
		flexDirection: 'row',
	},
	AppMainPreview: {
		flexGrow: 1,
		backgroundColor: colors.background,
		height: "100%",
		overflow: 'auto',
		display: 'flex',
		flexDirection: 'column'
	}
}

const limitToMax = (v, maxV) => ((v > maxV) ? maxV : v);

const checkValidSize = (s) => {
	if (s < 0 || s > 9999)
		return false;
	return true;
}

class App extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			timelineOrganizerDrawerToggle: true,
			timelineOrganizerDrawerWidth: DEFAULT_TIMELINE_ORGANIZER_WIDTH,
			timelineEditorDrawerToggle: true,
			timelineEditorDrawerWidth: DEFAULT_TIMELINE_EDITOR_WIDTH,
			zoomScale: 1,
		}

		this.openTimelineOgranizerDrawer = () => {
			let newResWidth = document.querySelector('#main-body').offsetWidth;
			let maxZoomWidth = newResWidth;
			newResWidth = limitToMax(this.state.zoomWidthByUser, maxZoomWidth);
			this.setState({
				timelineOrganizerDrawerToggle: true,
				zoomWidth: newResWidth,
				zoomWidthByUser: newResWidth,
				maxZoomWidth: maxZoomWidth,
			});
		}

		this.closeTimelineOgranizerDrawer = () => {
			let newResWidth = document.querySelector('#main-body').offsetWidth;
			let maxZoomWidth = newResWidth;
			newResWidth = limitToMax(this.state.zoomWidthByUser, maxZoomWidth);
			this.setState({
				timelineOrganizerDrawerToggle: 0,
				zoomWidth: newResWidth,
				zoomWidthByUser: newResWidth,
				maxZoomWidth: maxZoomWidth,
			});
		}

		this.openTimelineEditorDrawer = () => {
			let newResWidth = document.querySelector('#main-body').offsetWidth;
			let maxZoomWidth = newResWidth;
			newResWidth = limitToMax(this.state.zoomWidthByUser, maxZoomWidth);
			this.setState({
				timelineEditorDrawerToggle: true,
				zoomWidth: newResWidth,
				zoomWidthByUser: newResWidth,
				maxZoomWidth: maxZoomWidth,
			});
		}

		this.closeTimelineEditorDrawer = () => {
			let newResWidth = document.querySelector('#main-body').offsetWidth;
			let maxZoomWidth = newResWidth;
			newResWidth = limitToMax(this.state.zoomWidthByUser, maxZoomWidth);
			this.setState({
				timelineEditorDrawerToggle: false,
				zoomWidth: newResWidth,
				zoomWidthByUser: newResWidth,
				maxZoomWidth: maxZoomWidth,
			});
		}

		this.setZoomScale = (op) => {
			let scale;
			switch (op) {
				case "0":
					scale = 0.25;
					break;
				case "1":
					scale = 0.5;
					break;
				case "2":
					scale = 0.75;
					break;
				case "3":
					scale = 1;
					break;
				case "4":
					scale = 1.25;
					break;
				case "5":
					scale = 1.5;
					break;
				default:
					scale = 1;
			}

			let desiredW = this.state.zoomWidthByUser;
			let desiredH = this.state.zoomHeightByUser;
			let newZoomWidth = Math.round(desiredW * scale);
			let newZoomHeight = Math.round(desiredH * scale);

			while (newZoomWidth > this.state.maxZoomWidth) {
				desiredW -= 1;
				newZoomWidth = Math.round(desiredW * scale);
			}
			while (newZoomHeight > this.state.maxZoomHeight) {
				desiredH -= 1;
				newZoomHeight = Math.round(desiredH * scale);
			}

			this.setState({
				zoomScale: scale,
				zoomWidth: (scale < 1) ? this.state.zoomWidth : newZoomWidth,
				zoomWidthByUser: (scale < 1) ? Math.round(this.state.zoomWidthByUser / (scale/this.state.zoomScale)) : desiredW,
				zoomHeight: (scale < 1) ? this.state.zoomHeight : newZoomHeight,
				zoomHeightByUser: (scale < 1) ? Math.round(this.state.zoomHeightByUser / (scale/this.state.zoomScale)) :desiredH,
			});
		}

		this.onInputZoomHeight = (e) => {
			let newValue = parseFloat(e.target.value);
			if (checkValidSize(newValue)) {
				this.setState({
					zoomHeightByUser: newValue
				})
			}
		}

		this.setZoomWidth = (e) => {
			if (e.which === 13) {
				let scale = this.state.zoomScale;
				let desired = this.state.zoomWidthByUser;
				let newZoomWidth = desired * scale;
				while (newZoomWidth > this.state.maxZoomWidth) {
					scale -= 0.01;
					newZoomWidth = desired * scale;
				}
				newZoomWidth = Math.round(newZoomWidth);
				this.setState({
					zoomWidth: newZoomWidth,
					zoomScale: scale
				})
			}
		}

		this.onInputZoomWidth = (e) => {
			let newValue = parseFloat(e.target.value);
			if (checkValidSize(newValue)) {
				this.setState({
					zoomWidthByUser: newValue
				})
			}
		}

		this.setZoomHeight = (e) => {
			if (e.which === 13) {
				let scale = this.state.zoomScale;
				let desired = this.state.zoomHeightByUser;
				let newZoomHeight = desired * scale;
				while (newZoomHeight > this.state.maxZoomHeight) {
					scale -= 0.01;
					newZoomHeight = desired * scale;
				}
				this.setState({
					zoomHeight: newZoomHeight,
					zoomScale: scale
				})
			}
		}

		this.setZoomMaxHeight = () => {
			let maxHeight = document.querySelector('#main-body').offsetHeight;
			let {
				zoomHeight,
				zoomHeightByUser
			} = this.state;
			zoomHeight = limitToMax(zoomHeight, maxHeight);
			zoomHeightByUser = limitToMax(zoomHeightByUser, maxHeight);
			this.setState({
				maxZoomHeight: maxHeight,
				zoomHeight: zoomHeight,
				zoomHeightByUser: zoomHeightByUser
			})
		}

		this.onSelect = (e) => {
			let op = e.target.value;
			if (op >= 0) {
				this.setZoomScale(op);
			}
		}
	}

	render() {
		const {
			timelineOrganizerDrawerToggle,
			timelineOrganizerDrawerWidth,
			timelineEditorDrawerToggle,
			timelineEditorDrawerWidth,
			zoomScale,
			zoomWidth,
			zoomHeight,
			zoomWidthByUser,
			zoomHeightByUser,
		} = this.state;

		const {
			openTimelineOgranizerDrawer,
			closeTimelineOgranizerDrawer,
			openTimelineEditorDrawer,
			closeTimelineEditorDrawer,
			onInputZoomHeight,
			onInputZoomWidth,
			setZoomHeight,
			setZoomWidth,
			onSelect,
		} = this;

		return (
			<div className="App" style={style.App}>
				<div className="Appbar-Container" style={style.AppbarContainer}>
					<Appbar 
						drawerOpened={timelineOrganizerDrawerToggle}
						drawerOpenCallback={openTimelineOgranizerDrawer}
	  					drawerCloseCallback={closeTimelineOgranizerDrawer}
					/>
				</div>
	  			<div className="App-Main-Container" style={style.AppMainContainer}>
	  				<TimelineNodeOrganizer
	  					open={timelineOrganizerDrawerToggle}
	  					openTimelineEditorCallback={openTimelineEditorDrawer}
	  					closeTimelineEditorCallback={closeTimelineEditorDrawer}
	  				/>
	  				<div className="App-Main-Preivew"
	  					id="main-body"
	  					style={style.AppMainPreview}
	  				>
		  				<ZoomBar
		  						zoomScale={zoomScale}
		  						zoomWidth={zoomWidth}
		  						zoomHeight={zoomHeight}
		  						zoomHeightByUser={zoomHeightByUser}
		  						zoomWidthByUser={zoomWidthByUser}
		  						setZoomHeight={setZoomHeight}
		  						setZoomWidth={setZoomWidth}
		  						onInputZoomHeight={onInputZoomHeight}
		  						onInputZoomWidth={onInputZoomWidth}
		  						onSelect={onSelect}
		  				/>
		  				<PreviewWindow
		  						zoomScale={zoomScale}
		  						zoomWidth={zoomWidth}
		  						zoomHeight={zoomHeight}
		  				/>
	  				</div>
	  				<TimelineNodeEditor 
	  					open={timelineEditorDrawerToggle}
	  					width={timelineEditorDrawerWidth}
	  					openTimelineEditorCallback={openTimelineEditorDrawer}
	  					closeTimelineEditorCallback={closeTimelineEditorDrawer}
	  				/>
	  			</div>
	  			<Notification />
  			</div>
  		);
	}
}


export default App;
