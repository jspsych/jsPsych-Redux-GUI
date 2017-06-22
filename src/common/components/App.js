import React from 'react';
import Preview from '../containers/Preview';
import Appbar from '../containers/Appbar';
import TimelineNodeOrganizer from '../containers/TimelineNodeOrganizer';
import TimelineNodeEditor from '../containers/TimelineNodeEditor';
import RegisterWindow from '../containers/RegisterWindow';


import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const DEFAULT_TIMELINE_ORGANIZER_WIDTH = 20;

export const convertPercent = (number) => (number + '%');

const mainBodyWidth = (leftDrawer, leftWidth, rightDrawer) => {
	let width = 100;
	if (leftDrawer) width -= leftWidth;
	if (rightDrawer) width -= 20;
	return convertPercent(width);
}

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			timelineOrganizerDrawerToggle: true,
			timelineOrganizerDrawerWidth: DEFAULT_TIMELINE_ORGANIZER_WIDTH,
			timelineEditorDrawerToggle: false,
		}

		this.setTimelineOrangizerWidth = (width) => {
			let mainBodyW = document.querySelector('#main-body').offsetWidth;
			let {
				timelineOrganizerDrawerWidth: leftWidth,
				timelineEditorDrawerToggle: rightDrawer
			} = this.state;
			let parent = mainBodyW / this.mainBodyPercent(true, leftWidth, rightDrawer);

			let newMainBodyWP = this.mainBodyPercent(true, width, rightDrawer);
			let newMainBodyW = newMainBodyWP * parent;
			let newResWidth = Math.round(newMainBodyW * 0.9);
			let maxResWidth = newResWidth;
			if (this.state.resWidth < newResWidth) {
				newResWidth = this.state.resWidth;
			}
			this.setState({
				timelineOrganizerDrawerWidth: width,
				resWidth: newResWidth,
				resWidthV: newResWidth,
				maxResWidth: maxResWidth,
			});
		}

		this.mainBodyPercent = (leftDrawer, leftWidth, rightDrawer) => {
			let res = 1;
			if (leftDrawer) res -= leftWidth / 100;
			if (rightDrawer) res -= 0.2;
			return res
		}

		this.calcNewResWidth = (oranizer=true, width=null) => {
			let mainBodyW = document.querySelector('#main-body').offsetWidth;
			let {
				timelineOrganizerDrawerToggle: leftDrawer,
				timelineOrganizerDrawerWidth: leftWidth,
				timelineEditorDrawerToggle: rightDrawer
			} = this.state;

			if (width !== null) {
				leftWidth = width;
			}

			let parent = mainBodyW / this.mainBodyPercent(leftDrawer, leftWidth, rightDrawer);
			if (oranizer) leftDrawer = !leftDrawer;
			else rightDrawer = !rightDrawer;
			let newMainBodyW = parent * this.mainBodyPercent(leftDrawer, leftWidth, rightDrawer);

			return Math.round(newMainBodyW * 0.9);
		}

		this.openTimelineOgranizerDrawer = () => {
			let newResWidth = this.calcNewResWidth();
			let maxResWidth = newResWidth;
			if (this.state.resWidthV < newResWidth) {
				newResWidth = this.state.resWidthV;
			}
			this.setState({
				timelineOrganizerDrawerToggle: true,
				resWidth: newResWidth,
				resWidthV: newResWidth,
				maxResWidth: maxResWidth,
			});
		}

		this.closeTimelineOgranizerDrawer = () => {
			let newResWidth = this.calcNewResWidth();
			let maxResWidth = newResWidth;
			if (this.state.resWidthV < newResWidth) {
				newResWidth = this.state.resWidthV;
			}
			this.setState({
				timelineOrganizerDrawerToggle: 0,
				resWidth: newResWidth,
				resWidthV: newResWidth,
				maxResWidth: maxResWidth,
			});
		}

		this.openTimelineEditorDrawer = () => {
			let newResWidth = this.calcNewResWidth(false);
			let maxResWidth = newResWidth;
			if (this.state.resWidthV < newResWidth) {
				newResWidth = this.state.resWidthV;
			}
			this.setState({
				timelineEditorDrawerToggle: true,
				resWidth: newResWidth,
				resWidthV: newResWidth,
				maxResWidth: maxResWidth,
			});
		}

		this.closeTimelineEditorDrawer = () => {
			let newResWidth = this.calcNewResWidth(false);
			let maxResWidth = newResWidth;
			if (this.state.resWidthV < newResWidth) {
				newResWidth = this.state.resWidthV;
			}
			this.setState({
				timelineEditorDrawerToggle: false,
				resWidth: newResWidth,
				resWidthV: newResWidth,
				maxResWidth: maxResWidth,
			});
		}

		this.checkValidSize = (s) => {
			if (s < 0 || s > 9999)
				return false;
			return true;
		}

		this.onResponsiveInputH = (e) => {
			let newValue = parseFloat(e.target.value);
			if (this.checkValidSize(newValue)) {
				this.setState({
					resHeightV: newValue
				})
			}
		}

		this.onResponsiveInputW = (e) => {
			let newValue = parseFloat(e.target.value);
			if (this.checkValidSize(newValue)) {
				this.setState({
					resWidthV: newValue
				})
			}
		}

		this.setResponsiveInputW = (e) => {
			if (e.which === 13) {
				let newValue = this.state.resWidthV;
				if (newValue > this.state.maxResWidth) {
					newValue = this.state.maxResWidth
				}
				this.setState({
					resWidth: newValue,
					resWidthV: newValue
				})
			}
		}

		this.setResponsiveInputH = (e) => {
			if (e.which === 13) {
				let newValue = this.state.resHeightV;
				if (newValue > this.state.maxResHeight) {
					newValue = this.state.maxResHeight
				}
				this.setState({
					resHeight: newValue,
					resHeightV: newValue
				})
			}
		}
	}

	componentWillMount() {
		document.addEventListener('onresizewindow', () => {
			let resHeight = Math.round(document.querySelector('#main-body').offsetHeight * 0.8);
			this.setState({
				resHeight: resHeight,
				resHeightV: resHeight,
				maxResHeight: resHeight,
			})
		})
	}

	componentDidMount() {
		// init
		let resWidth = Math.round(document.querySelector('#main-body').offsetWidth * 0.9);
		let resHeight = Math.round(document.querySelector('#main-body').offsetHeight * 0.8);
		this.setState({
			resWidth: resWidth,
			resHeight: resHeight,
			resWidthV: resWidth,
			resHeightV: resHeight,
			maxResWidth: resWidth,
			maxResHeight: resHeight,
		});
	}

	// componentDidUpdate() {
	// 	this.setState({
	// 		resWidth: document.querySelector('#main-body').offsetWidth * 0.9,
	// 		resWidtV: document.querySelector('#main-body').offsetWidth * 0.9,
	// 	})
	// }

	render() {
		return (
			<MuiThemeProvider>
			<div className="App" style={{overflowX: 'hidden', overflowY: 'auto', height: "100%"}}>
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
	  				<div className="main-body"
	  					id="main-body"
	  					style={{width: mainBodyWidth(this.state.timelineOrganizerDrawerToggle,
	  												this.state.timelineOrganizerDrawerWidth,
	  												this.state.timelineEditorDrawerToggle),
	  					 margin: '0 auto',
							 backgroundColor: 'rgb(232, 232, 232)'
	  					}}
	  				>
	  				<Preview parentId="main-body" 
	  						resWidth={this.state.resWidth}
	  						resHeight={this.state.resHeight}
	  						resWidthV={this.state.resWidthV}
	  						resHeightV={this.state.resHeightV}
	  						onResponsiveInputH={this.onResponsiveInputH}
					        onResponsiveInputW={this.onResponsiveInputW}
					        setResponsiveInputH={this.setResponsiveInputH}
					        setResponsiveInputW={this.setResponsiveInputW}
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
