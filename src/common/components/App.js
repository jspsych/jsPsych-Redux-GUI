import React from 'react';

import Preview from './Preview';
import Appbar from '../containers/Appbar';
import TimelineNodeOrganizerDrawer from '../containers/TimelineNode/TimelineNodeOrganizerDrawer';
import TimelineNodeEditorDrawer from './TimelineNode/TimelineNodeEditorDrawer';

const convertPercent = (number) => (number + '%'); 

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			timelineOrganizerDrawerToggle: true,
			timelineEditorDrawerToggle: false,
		}

		this.toggleTimelineOrganizerDrawer = () => {
			this.setState({
				timelineOrganizerDrawerToggle: !this.state.timelineOrganizerDrawerToggle,
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
  			<div className="main-container" style={{width: '100%', display: 'flex', overflowX: 'hidden'}}>
  				<TimelineNodeOrganizerDrawer open={this.state.timelineOrganizerDrawerToggle} 
  					openTimelineEditorCallback={this.openTimelineEditorDrawer} 
  					toggleTimelineOrganizerCallback={this.toggleTimelineOrganizerDrawer} 
  				/>
  				<div id="main" style={{width: convertPercent(this.props.width)}}>
  					<Appbar />
  					<Preview />
  				</div>
  				<TimelineNodeEditorDrawer open={this.state.timelineEditorDrawerToggle} 
  					openTimelineEditorCallback={this.openTimelineEditorDrawer} 
  					closeTimelineEditorCallback={this.closeTimelineEditorDrawer}
  				/>
  			</div>
  		);
	}
}

export default App;

