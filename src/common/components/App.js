import React from 'react';
import Preview from '../containers/Preview';
import Appbar from '../containers/Appbar';
import TimelineNodeOrganizer from '../containers/TimelineNodeOrganizer';
import TimelineNodeEditor from '../containers/TimelineNodeEditor';
import RegisterWindow from '../containers/RegisterWindow';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Zoom from 'material-ui/svg-icons/action/zoom-in';
import {
  grey600 as textColor
} from 'material-ui/styles/colors';

import { getFullScreenState } from './Preview';

const DEFAULT_TIMELINE_ORGANIZER_WIDTH = 20;

export const convertPercent = (number) => (number + '%');

const mainBodyWidth = (leftDrawer, leftWidth, rightDrawer) => {
	let width = 100;
	if (leftDrawer) width -= leftWidth;
	if (rightDrawer) width -= 20;
	return convertPercent(width);
}

const mainBodyPercent = (leftDrawer, leftWidth, rightDrawer) => {
	let res = 1;
	if (leftDrawer) res -= leftWidth / 100;
	if (rightDrawer) res -= 0.2;
	return res
}

const limitToMax = (v, maxV) => ((v > maxV) ? maxV : v);

const checkValidSize = (s) => {
	if (s < 0 || s > 9999)
		return false;
	return true;
}

class App extends React.Component {
	state = {
		timelineOrganizerDrawerToggle: true,
		timelineOrganizerDrawerWidth: DEFAULT_TIMELINE_ORGANIZER_WIDTH,
		timelineEditorDrawerToggle: false,
		zoomScale: 1,
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

	calcNewResWidth = (oranizer = true, width = null) => {
		let mainBodyW = document.querySelector('#main-body').offsetWidth;
		let {
			timelineOrganizerDrawerToggle: leftDrawer,
			timelineOrganizerDrawerWidth: leftWidth,
			timelineEditorDrawerToggle: rightDrawer
		} = this.state;

		if (width !== null) {
			leftWidth = width;
		}

		let parent = mainBodyW / mainBodyPercent(leftDrawer, leftWidth, rightDrawer);
		if (oranizer) leftDrawer = !leftDrawer;
		else rightDrawer = !rightDrawer;
		let newMainBodyW = parent * mainBodyPercent(leftDrawer, leftWidth, rightDrawer);

		return Math.round(newMainBodyW * 0.9);
	}

	setTimelineOrangizerWidth = (width) => {
		let mainBodyW = document.querySelector('#main-body').offsetWidth;
		let {
			timelineOrganizerDrawerWidth: leftWidth,
			timelineEditorDrawerToggle: rightDrawer
		} = this.state;
		let parent = mainBodyW / mainBodyPercent(true, leftWidth, rightDrawer);

		let newMainBodyWP = mainBodyPercent(true, width, rightDrawer);
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

	openTimelineOgranizerDrawer = () => {
		let newResWidth = this.calcNewResWidth();
		let maxZoomWidth = newResWidth;
		newResWidth = limitToMax(this.state.zoomWidthByUser, maxZoomWidth);
		this.setState({
			timelineOrganizerDrawerToggle: true,
			zoomWidth: newResWidth,
			zoomWidthByUser: newResWidth,
			maxZoomWidth: maxZoomWidth,
		});
	}

	closeTimelineOgranizerDrawer = () => {
		let newResWidth = this.calcNewResWidth();
		let maxZoomWidth = newResWidth;
		newResWidth = limitToMax(this.state.zoomWidthByUser, maxZoomWidth);
		this.setState({
			timelineOrganizerDrawerToggle: 0,
			zoomWidth: newResWidth,
			zoomWidthByUser: newResWidth,
			maxZoomWidth: maxZoomWidth,
		});
	}

	openTimelineEditorDrawer = () => {
		let newResWidth = this.calcNewResWidth(false);
		let maxZoomWidth = newResWidth;
		newResWidth = limitToMax(this.state.zoomWidthByUser, maxZoomWidth);
		this.setState({
			timelineEditorDrawerToggle: true,
			zoomWidth: newResWidth,
			zoomWidthByUser: newResWidth,
			maxZoomWidth: maxZoomWidth,
		});
	}

	closeTimelineEditorDrawer = () => {
		let newResWidth = this.calcNewResWidth(false);
		let maxZoomWidth = newResWidth;
		newResWidth = limitToMax(this.state.zoomWidthByUser, maxZoomWidth);
		this.setState({
			timelineEditorDrawerToggle: false,
			zoomWidth: newResWidth,
			zoomWidthByUser: newResWidth,
			maxZoomWidth: maxZoomWidth,
		});
	}

	setZoomScale = (op) => {
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

	onInputZoomHeight = (e) => {
		let newValue = parseFloat(e.target.value);
		if (checkValidSize(newValue)) {
			this.setState({
				zoomHeightByUser: newValue
			})
		}
	}

	setZoomWidth = (e) => {
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

	onInputZoomWidth = (e) => {
		let newValue = parseFloat(e.target.value);
		if (checkValidSize(newValue)) {
			this.setState({
				zoomWidthByUser: newValue
			})
		}
	}

	setZoomHeight = (e) => {
		if (e.which === 13) {
			let newZoomHeight = limitToMax(this.state.zoomHeightByUser, this.state.maxZoomHeight);
			this.setState({
				zoomHeight: newZoomHeight,
				zoomHeightByUser: newZoomHeight,
				// zoomScale: scale
			})
		}
	}

	setZoomMaxHeight = () => {
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

	onSelect = (e) => {
		let op = e.target.value;
		if (op >= 0) {
			this.setZoomScale(op);
		}
	}

	render() {
		const {
			zoomScale,
			zoomWidth,
			zoomHeight,
			zoomWidthByUser,
			zoomHeightByUser,
		} = this.state;

		const responsiveTextFieldStyle = {
			maxWidth: 40,
			minWidth: 40,
			height: 22.8,
			// border: 'none',
			// borderBottom: '1px solid black',
			// backgroundColor: 'rgb(232, 232, 232)',
			outline: 'none',
			color: textColor,
			textAlign: 'center'
		};
		return (
			<MuiThemeProvider>
			<div className="App" style={{overflowX: 'hidden', overflowY: 'hidden', height: "100%"}}>
				<div className="appbar-container" style={{height: "20%"}}>
					<Appbar />
				</div>
	  			<div className="main-container" style={{width: '100%', display: 'flex', height: "80%"}}>
	  				<TimelineNodeOrganizer
	  					open={this.state.timelineOrganizerDrawerToggle}
	  					width={this.state.timelineOrganizerDrawerWidth}
	  					openCallback={this.openTimelineOgranizerDrawer}
	  					closeCallback={this.closeTimelineOgranizerDrawer}
	  					setWidthCallback={this.setTimelineOrangizerWidth}
	  					openTimelineEditorCallback={this.openTimelineEditorDrawer}
	  					closeTimelineEditorCallback={this.closeTimelineEditorDrawer}
	  				/>
	  				<div 
	  					className="main-body"
	  					id="main-body"
	  					style={{
	  						width: mainBodyWidth(this.state.timelineOrganizerDrawerToggle,
	  												this.state.timelineOrganizerDrawerWidth,
	  												this.state.timelineEditorDrawerToggle),
	  					 	margin: '0 auto',
						 	backgroundColor: (getFullScreenState()) ? 'black' : 'rgb(232, 232, 232)',
						 	display: 'flex-col'
	  					}}
	  				>
	  				<div style={{
	  					width:"90%", 
	  					margin: '0 auto', 
	  				}}
	  				>
	  				<span style={{
	  					paddingTop: 5,
	  					paddingBottom: 5,
	  					// paddingLeft: 3,
	  					display: 'flex', 
	  					// width: 185,
	  					// margin: '0 auto',
	  					// backgroundColor: 'rgb(232, 232, 232)'
	  				}}>	
			              <input 
			                className="Responsive-input" 
			                style={responsiveTextFieldStyle} 
			                title={"width: " + zoomWidthByUser + "px"}
			                type='number'
			                value={zoomWidthByUser}
			                onChange={this.onInputZoomWidth}
			                onKeyPress={this.setZoomWidth}
			                onBlur={() => { let e = {which: 13}; this.setZoomWidth(e) }}
			              />
			              <div style={{
			              	paddingLeft: 8, 
			              	paddingRight: 8, 
			              	color: (getFullScreenState()) ? 'white' : textColor,
			              }}>x</div>
			              <input 
			                className="Responsive-input" 
			                style={responsiveTextFieldStyle} 
			                title={"height: " + zoomHeightByUser + "px"}
			                type='number'
			                value={zoomHeightByUser}
			                onChange={this.onInputZoomHeight}
			                onKeyPress={this.setZoomHeight}
			                onBlur={() => { let e = {which: 13}; this.setZoomHeight(e) }}
			              />
			              <div style={{paddingLeft: 16}}>
			                <select value={-1} 
			                        style={{
			                          outline: 'none', 
			                          color: textColor, 
			                          height: 22.8
			                        }} 
			                        title={"Zoom: " + Math.round(zoomScale * 100) + '%'}
			                        onChange={this.onSelect}
			                >
			                  <option value={-1}>{Math.round(zoomScale * 100) + '%'}</option>
			                  <option value={0}>25%</option>
			                  <option value={1}>50%</option>
			                  <option value={2}>75%</option>
			                  <option value={3}>100%</option>
			                  <option value={4}>125%</option>
			                  <option value={5}>150%</option>
			                </select>
			              </div>
			        	</span>
			        </div>
	  				<Preview 
	  						zoomScale={this.state.zoomScale}
	  						zoomWidth={this.state.zoomWidth}
	  						zoomHeight={this.state.zoomHeight}
	  				/>
	  				</div>
	  				<TimelineNodeEditor open={this.state.timelineEditorDrawerToggle}
	  					openTimelineEditorCallback={this.openTimelineEditorDrawer}
	  					closeTimelineEditorCallback={this.closeTimelineEditorDrawer}
	  				/>

	  			</div>
					<RegisterWindow />
  			</div>
  			</MuiThemeProvider>
  		);
	}
}


export default App;
