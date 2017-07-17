import React from 'react';

import PreviewWindow from '../containers/PreviewWindow';
import ZoomBar from './PreviewWindow/ZoomBar';
import Appbar from '../containers/Appbar';
import TimelineNodeOrganizer from '../containers/TimelineNodeOrganizer';
import TimelineNodeEditor from '../containers/TimelineNodeEditor';

import { getFullScreenState } from './PreviewWindow';
import Notification from '../containers/Notification';
import { MIN_WIDTH as DEFAULT_TIMELINE_EDITOR_WIDTH } from './TimelineNodeEditor';

const DEFAULT_TIMELINE_ORGANIZER_WIDTH = 20;

export const convertPercent = (number) => (number + '%');

const mainBodyWidth = (leftDrawer, leftWidth, rightDrawer, rightWidth=20) => {
	let width = 100;
	if (leftDrawer) width -= leftWidth;
	if (rightDrawer) width -= rightWidth;
	return convertPercent(width);
}

const mainBodyPercent = (leftDrawer, leftWidth, rightDrawer, rightWidth=20) => {
	let res = 1;
	if (leftDrawer) res -= leftWidth / 100;
	if (rightDrawer) res -= rightWidth / 100;
	return res
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
			timelineEditorDrawerToggle: false,
			timelineEditorDrawerWidth: DEFAULT_TIMELINE_EDITOR_WIDTH,
			zoomScale: 1,
		}

		this.calcNewResWidth = (desiredLeftDrawer, width = null, desiredRightDrawer) => {
			let mainBodyW = document.querySelector('#main-body').offsetWidth;
			let {
				timelineOrganizerDrawerToggle: leftDrawer,
				timelineOrganizerDrawerWidth: leftWidth,
				timelineEditorDrawerToggle: rightDrawer,
				timelineEditorDrawerWidth: rightWidth,
			} = this.state;

			if (width !== null) {
				leftWidth = width;
			}

			let parent = mainBodyW / mainBodyPercent(leftDrawer, leftWidth, rightDrawer, rightWidth);

			let newMainBodyW = parent * mainBodyPercent(desiredLeftDrawer, leftWidth, desiredRightDrawer, rightWidth);

			return Math.round(newMainBodyW * 0.9);
		}

		this.setTimelineOrangizerWidth = (width) => {
			let mainBodyW = document.querySelector('#main-body').offsetWidth;
			let {
				timelineOrganizerDrawerWidth: leftWidth,
				timelineEditorDrawerToggle: rightDrawer,
				timelineEditorDrawerWidth: rightWidth,
			} = this.state;
			let parent = mainBodyW / mainBodyPercent(true, leftWidth, rightDrawer, rightWidth);

			let newMainBodyWP = mainBodyPercent(true, width, rightDrawer, rightWidth);
			let newMainBodyW = newMainBodyWP * parent;
			let newResWidth = Math.round(newMainBodyW * 0.9);
			let maxZoomWidth = newResWidth;
			if (this.state.zoomWidthByUser < newResWidth) {
				newResWidth = this.state.zoomWidthByUser;
			}
			this.setState({
				timelineOrganizerDrawerWidth: width,
				zoomWidth: newResWidth,
				zoomWidthByUser: newResWidth,
				maxZoomWidth: maxZoomWidth,
			});
		}

		this.openTimelineOgranizerDrawer = () => {
			let newResWidth = this.calcNewResWidth(true, null, this.state.timelineEditorDrawerToggle);
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
			let newResWidth = this.calcNewResWidth(false, null, this.state.timelineEditorDrawerToggle);
			let maxZoomWidth = newResWidth;
			newResWidth = limitToMax(this.state.zoomWidthByUser, maxZoomWidth);
			this.setState({
				timelineOrganizerDrawerToggle: 0,
				zoomWidth: newResWidth,
				zoomWidthByUser: newResWidth,
				maxZoomWidth: maxZoomWidth,
			});
		}

		this.setTimelineEditorWidth = (width) => {
			let mainBodyW = document.querySelector('#main-body').offsetWidth;
			let {
				timelineOrganizerDrawerToggle: leftDrawer,
				timelineOrganizerDrawerWidth: leftWidth,
				timelineEditorDrawerWidth: rightWidth,
			} = this.state;
			let parent = mainBodyW / mainBodyPercent(leftDrawer, leftWidth, true, rightWidth);

			let newMainBodyWP = mainBodyPercent(leftDrawer, leftWidth, true, width);
			let newMainBodyW = newMainBodyWP * parent;
			let newResWidth = Math.round(newMainBodyW * 0.9);
			let maxZoomWidth = newResWidth;
			if (this.state.zoomWidthByUser < newResWidth) {
				newResWidth = this.state.zoomWidthByUser;
			}
			this.setState({
				timelineEditorDrawerWidth: width,
				zoomWidth: newResWidth,
				zoomWidthByUser: newResWidth,
				maxZoomWidth: maxZoomWidth,
			});
		}

		this.openTimelineEditorDrawer = () => {
			let newResWidth = this.calcNewResWidth(this.state.timelineOrganizerDrawerToggle, null, true);
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
			let newResWidth = this.calcNewResWidth(this.state.timelineOrganizerDrawerToggle, null, false);
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

			let desired = this.state.zoomWidthByUser;
			let newZoomWidth = Math.round(desired * scale);

			while (newZoomWidth > this.state.maxZoomWidth) {
				desired -= 1;
				newZoomWidth = Math.round(desired * scale);
			}

			this.setState({
				zoomScale: scale,
				zoomWidth: newZoomWidth,
				zoomWidthByUser: desired
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
					newZoomWidth = desired * scale
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
				let newZoomHeight = limitToMax(this.state.zoomHeightByUser, this.state.maxZoomHeight);
				this.setState({
					zoomHeight: newZoomHeight,
					zoomHeightByUser: newZoomHeight,
					// zoomScale: scale
				})
			}
		}

		this.setZoomMaxHeight = () => {
			let maxHeight = Math.round(document.querySelector('#main-body').offsetHeight * 0.8);
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

	componentWillMount() {
		window.addEventListener("resize", this.setZoomMaxHeight);
	}

	componentDidMount() {
		// init
		let zoomWidth = Math.round(document.querySelector('#main-body').offsetWidth * 0.9);
		let zoomHeight = Math.round(document.querySelector('#main-body').offsetHeight * 0.8);
		this.setState({
			zoomWidth: zoomWidth,
			zoomHeight: zoomHeight,
			zoomWidthByUser: zoomWidth,
			zoomHeightByUser: zoomHeight,
			maxZoomWidth: zoomWidth,
			maxZoomHeight: zoomHeight,
		});
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.setZoomMaxHeight);
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
			setTimelineOrangizerWidth,
			openTimelineEditorDrawer,
			closeTimelineEditorDrawer,
			setTimelineEditorWidth,
			onInputZoomHeight,
			onInputZoomWidth,
			setZoomHeight,
			setZoomWidth,
			onSelect,
		} = this;

		return (
			<div className="App" style={{overflow: 'hidden', height: "100%"}}>
				<div className="appbar-container" style={{height: "20%"}}>
					<Appbar />
				</div>

	  			<div className="main-container" style={{width: '100%', display: 'flex', height: "80%"}}>
	  				<TimelineNodeOrganizer
	  					open={timelineOrganizerDrawerToggle}
	  					width={timelineOrganizerDrawerWidth}
	  					openCallback={openTimelineOgranizerDrawer}
	  					closeCallback={closeTimelineOgranizerDrawer}
	  					setWidthCallback={setTimelineOrangizerWidth}
	  					openTimelineEditorCallback={openTimelineEditorDrawer}
	  					closeTimelineEditorCallback={closeTimelineEditorDrawer}
	  				/>
	  				<div
	  					className="main-body"
	  					id="main-body"
	  					style={{
							width: mainBodyWidth(timelineOrganizerDrawerToggle,
								timelineOrganizerDrawerWidth,
								timelineEditorDrawerToggle,
								timelineEditorDrawerWidth),
	  					 	margin: '0 auto',
						 	backgroundColor: (getFullScreenState()) ? 'black' : 'rgb(232, 232, 232)',
						 	display: 'flex-col'
	  					}}
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
	  					setWidthCallback={setTimelineEditorWidth}
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
