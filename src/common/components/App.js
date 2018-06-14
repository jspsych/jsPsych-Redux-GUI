import React from 'react';

import PreviewWindow from '../containers/PreviewWindow';
import Appbar from '../containers/Appbar';
import TimelineNodeOrganizer from '../containers/TimelineNodeOrganizer';
import TimelineNodeEditor from '../containers/TimelineNodeEditor';
import Authentications from '../containers/Authentications';
import Notifications from '../containers/Notifications';

import ZoomBar from './PreviewWindow/ZoomBar';
import { getFullScreenState, PreviewWindowContainerWidth } from './PreviewWindow';
import { WIDTH as EditorWidth } from './TimelineNodeEditor/TimelineNodeEditor.jsx';
import { WIDTH as OrganizerWidth } from './TimelineNodeOrganizer/TimelineNodeOrganizer.jsx';


import GeneralTheme from './theme.js';

const colors = GeneralTheme.colors;

const style = {
	App: utils.prefixer({
		width: '100%',
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
	}),
	AppbarContainer: utils.prefixer({
		flexBasis: '56px',
		maxHeight: '56px',
		zIndex: 5,
		boxShadow: '0 2px 5px rgba(0,0,0, .26)',
	}),
	AppMainContainer: utils.prefixer({
		flexGrow: '1',
		width: '100%',
		height: '100%',
		display: 'flex',
		flexDirection: 'row',
	}),
	AppMainPreview: utils.prefixer({
		flexGrow: 1,
		backgroundColor: colors.background,
		height: "100%",
		overflow: 'hidden',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center'
	})
}

const isValidSize = (v) => (v !== null && v !== undefined && v >= 0);
const limitToMax = (v, maxV) => (!isValidSize(v) || v > maxV ? maxV : v);

const checkValidSize = (s) => (s >= 0);


class App extends React.Component {

	constructor(props) {
		super(props);

		this.state = {	
			timelineOrganizerDrawerToggle: true,
			timelineEditorDrawerToggle: false,
			zoomScale: 1,
			zoomWidth: null,
			zoomHeight: null,
			zoomWidthByUser: null,
			zoomHeightByUser: null,
			displayZoom: -1,
			test: 0
		}

		this.getMaxSize = () => {
			const {
				zoomWidth,
				zoomHeight,
				zoomWidthByUser,
				zoomHeightByUser,
				timelineOrganizerDrawerToggle : organizerOpened,
				timelineEditorDrawerToggle: editorOpened
			} = this.state;

			let left = organizerOpened ? OrganizerWidth : 0,
				right = editorOpened ? EditorWidth : 0,
				mainBodyWidth = this.AppPage.clientWidth - left - right,
				maxWidth = Math.round(mainBodyWidth * PreviewWindowContainerWidth),
				maxHeight = this.previewWindow.clientHeight;

			// let maxWidth = this.previewWindow.clientWidth,
			// 	maxHeight = this.previewWindow.clientHeight;

			return {
				zoomWidthByUser: limitToMax(zoomWidthByUser, maxWidth),
				zoomHeightByUser: limitToMax(zoomHeightByUser, maxHeight),
				zoomWidth: limitToMax(zoomWidth, maxWidth),
				zoomHeight: limitToMax(zoomHeight, maxHeight),
				maxZoomWidth: maxWidth,
				maxZoomHeight: maxHeight,
			}
		}

		this.updateMaxSize = () => {
			this.setState(this.getMaxSize());
		}

		this.openTimelineOgranizerDrawer = () => {
			this.setState({ timelineOrganizerDrawerToggle: true, }, this.updateMaxSize);
		}

		this.closeTimelineOgranizerDrawer = () => {
			this.setState({ timelineOrganizerDrawerToggle: false, }, this.updateMaxSize);
		}

		this.openTimelineEditorDrawer = () => {
			this.setState({ timelineEditorDrawerToggle: true, }, this.updateMaxSize);
		}

		this.closeTimelineEditorDrawer = () => {
			this.setState({ timelineEditorDrawerToggle: false, }, this.updateMaxSize);
		}

		this.setZoomWidth = (e) => {
			if (e.which === 13) {
				let {
					zoomScale: scale,
					zoomWidthByUser: desired,
					maxZoomWidth: max
				} = this.state;

				let newSize = desired * scale;
				if (newSize > max) scale = max / newSize;
				this.setState({
					zoomWidth: limitToMax(newSize, max),
					zoomScale: scale,
					displayZoom: -1,
				})
			}
		}

		this.setZoomHeight = (e) => {
			if (e.which === 13) {
				let {
					zoomScale: scale,
					zoomHeightByUser: desired,
					maxZoomHeight: max
				} = this.state;

				let newSize = desired * scale;
				if (newSize > max) scale = max / newSize;
				this.setState({
					zoomHeight: limitToMax(newSize, max),
					zoomScale: scale,
					displayZoom: -1,
				})
			}
		}

		this.setZoomScale = (scale) => {
			let {
				zoomWidthByUser,
				zoomHeightByUser,
				zoomScale
			} = this.state;

			this.setState({
				zoomScale: scale,
				zoomWidthByUser: Math.round(zoomWidthByUser / (scale/zoomScale)),
				zoomHeightByUser: Math.round(zoomHeightByUser / (scale/zoomScale)),
			});
		}

		this.onInputZoomHeight = (e) => {
			if (isValidSize(e.target.value)) {
				this.setState({
					zoomHeightByUser: e.target.value
				})
			}
		}

		this.onInputZoomWidth = (e) => {
			if (isValidSize(e.target.value)) {
				this.setState({
					zoomWidthByUser: e.target.value
				})
			}
		}

		this.setDisplayZoom = (event, index, value) => {
			this.setState({
				displayZoom: value
			})
			if (value >= 0) {
				this.setZoomScale(value);
			}
		}

		this.testBug = () => {
			this.setState({test: this.previewWindow.clientWidth}, 
				() => { 
					console.log(
						`${this.state.test}, should be ${this.getMaxSize().maxZoomWidth}`
					);
				}
			);
		}

		this.getAuthenticationsClass = () => {
			return this.Authentications;
		}
	}

	componentWillMount() {
		window.addEventListener("resize", this.updateMaxSize);
	}

	componentDidMount() {
		this.updateMaxSize();
		// this.testBug();
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.updateMaxSize);
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.shouldEditorStayOpen !== this.props.shouldEditorStayOpen) {
			this.setState({
				timelineEditorDrawerToggle: this.props.shouldEditorStayOpen,
			});
		}
		if (prevProps.shouldOrganizerStayOpen !== this.props.shouldOrganizerStayOpen) {
			this.setState({
				timelineOrganizerDrawerToggle: this.props.shouldOrganizerStayOpen
			});
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
			displayZoom
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
			setDisplayZoom,
		} = this;

		return (
			<div className="App" style={style.App} ref={el => this.AppPage = el}>
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
	  						zoomHeightByUser={zoomHeightByUser}
	  						zoomWidthByUser={zoomWidthByUser}
	  						displayZoom={displayZoom}
	  						setZoomHeight={setZoomHeight}
	  						setZoomWidth={setZoomWidth}
	  						onInputZoomHeight={onInputZoomHeight}
	  						onInputZoomWidth={onInputZoomWidth}
	  						setDisplayZoom={setDisplayZoom}
		  				/>
		  				<PreviewWindow
	  						zoomScale={zoomScale}
	  						zoomWidth={zoomWidth}
	  						zoomHeight={zoomHeight}
	  						sizeRef={el => this.previewWindow = el}
		  				/>
	  				</div>
	  				<TimelineNodeEditor 
	  					open={timelineEditorDrawerToggle}
	  					width={timelineEditorDrawerWidth}
	  					openTimelineEditorCallback={openTimelineEditorDrawer}
	  					closeTimelineEditorCallback={closeTimelineEditorDrawer}
	  				/>
	  			</div>
	  			<Notifications />	
	  			<Authentications />
  			</div>
  		);
	}
}


export default App;
