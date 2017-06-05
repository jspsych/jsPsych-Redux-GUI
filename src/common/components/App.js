import React from 'react';

import Preview from './Preview';
import Appbar from '../containers/Appbar';
import TimelineNodeOrganizerDrawer from '../containers/TimelineNode/TimelineNodeOrganizerDrawer';
import TimelineNodeEditorDrawer from './TimelineNode/TimelineNodeEditorDrawer';

const DEFAULT_TIMELINE_ORGANIZER_WIDTH = 20;

export const convertPercent = (number) => (number + '%'); 

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			timelineOrganizerDrawerToggle: true,
			timelineOrganizerDrawerWidth: DEFAULT_TIMELINE_ORGANIZER_WIDTH,
			timelineEditorDrawerToggle: false,
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
	}

	render() {
		return (
			<div className="App" style={{overflowX: 'hidden', height: "100%", overflowY: 'hidden'}}>
				<Appbar />
	  			<div className="main-container" style={{width: '100%', display: 'flex', height: "80%"}}>
	  				<TimelineNodeOrganizerDrawer 
	  					open={this.state.timelineOrganizerDrawerToggle}
	  					width={this.state.timelineOrganizerDrawerWidth}
	  					openCallback={this.openTimelineOgranizerDrawer}
	  					closeCallback={this.closeTimelineOgranizerDrawer}
	  					setWidthCallback={this.setTimelineOrangizerWidth}
	  					openTimelineEditorCallback={this.openTimelineEditorDrawer}
	  				/>
	  				<div className="main-body" 
	  					style={{width: (this.state.timelineOrganizerDrawerToggle) ?
	  									convertPercent(100-this.state.timelineOrganizerDrawerWidth) : "100%",
	  					 margin: '0 auto'
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

export default App;

