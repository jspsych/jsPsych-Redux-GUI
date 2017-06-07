import React from 'react';

import Preview from './Preview';
import Appbar from '../containers/Appbar';
import TimelineNodeOrganizerDrawer from '../containers/TimelineNode/TimelineNodeOrganizerDrawer';
import TimelineNodeEditorDrawer from './TimelineNode/TimelineNodeEditorDrawer';
//import TrialForm from './TimelineNode/TrialForm';

const DEFAULT_TIMELINE_ORGANIZER_WIDTH = 20;

export const convertPercent = (number) => (number + '%'); 

const mainBodyWidth = (leftDrawer, leftWidth, rightDrawer) => {
	let width = 100;
	if (leftDrawer) width -= leftWidth;
	if (rightDrawer) width -= 20;
	return convertPercent(width);
}

export default class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			timelineOrganizerDrawerToggle: true,
			timelineOrganizerDrawerWidth: DEFAULT_TIMELINE_ORGANIZER_WIDTH,
			timelineEditorDrawerToggle: false,
			experimentName: "Untitled Experiment",
		}

		this.setTimelineOrangizerWidth = (width) => {
			this.setState({
				timelineOrganizerDrawerWidth: width,
			});
		}

		this.openTimelineOgranizerDrawer = () => {
			this.setState({
				timelineOrganizerDrawerToggle: true,
			});
		}

		this.closeTimelineOgranizerDrawer = () => {
			this.setState({
				timelineOrganizerDrawerToggle: 0,
			});
		}

		this.openTimelineEditorDrawer = () => {
			this.setState({
				timelineEditorDrawerToggle: true,
			});
		}

		this.closeTimelineEditorDrawer = () => {
			this.setState({
				timelineEditorDrawerToggle: false,
			});
		}

		this.changeExperimentName = (newName) => {
			this.setState({
				experimentName: newName
			});
		}
	}

	render() {
		return (
			<div className="App" style={{overflowX: 'hidden', height: "100%"}}>
				<div className="appbar-container" style={{height: "20%"}}>
					<Appbar changeExperimentNameCallBack={this.state.changeExperimentName}/>
				</div>
	  			<div className="main-container" style={{width: '100%', display: 'flex', height: "80%"}}>
	  				<TimelineNodeOrganizerDrawer 
	  					open={this.state.timelineOrganizerDrawerToggle}
	  					width={this.state.timelineOrganizerDrawerWidth}
	  					openCallback={this.openTimelineOgranizerDrawer}
	  					closeCallback={this.closeTimelineOgranizerDrawer}
	  					setWidthCallback={this.setTimelineOrangizerWidth}
	  					openTimelineEditorCallback={this.openTimelineEditorDrawer}
	  					closeTimelineEditorCallback={this.closeTimelineEditorDrawer}
	  				/>
	  				<div className="main-body" 
	  					style={{width: mainBodyWidth(this.state.timelineOrganizerDrawerToggle, 
	  												this.state.timelineOrganizerDrawerWidth, 
	  												this.state.timelineEditorDrawerToggle),
	  					 margin: '0 auto',
	  					}}
	  				>
	  				<Preview />
	  				</div>
	  				<TimelineNodeEditorDrawer open={this.state.timelineEditorDrawerToggle} 
	  					openTimelineEditorCallback={this.openTimelineEditorDrawer} 
	  					closeTimelineEditorCallback={this.closeTimelineEditorDrawer}
	  				/>
	  			</div>
  			</div>
  		);
	}
}


