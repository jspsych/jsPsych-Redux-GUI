import React from 'react';

import Preview from './Preview';
import Appbar from '../containers/Appbar';
import TimelineNodeOrganizerDrawer from '../containers/TimelineNode/TimelineNodeOrganizerDrawer';
import TimelineNodeEditorDrawer from './TimelineNode/TimelineNodeEditorDrawer';

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			timelineOrganizerDrawerToggle: true,
			timelineEditorDrawerToggle: true,
		}

		this.toggleTimelineOrganizerDrawer = () => {
			this.setState({
				timelineOrganizerDrawerToggle: !this.state.timelineOrganizerDrawerToggle,
			});
		}

		this.toggleTimelineEditorDrawer = () => {
			this.setState({
				timelineEditorDrawerToggle: !this.state.timelineEditorDrawerToggle,
			});
		}
	}

	render() {

		return (
  			<div className="main-container" style={{width: '100%', display: 'flex'}}>
  				<TimelineNodeOrganizerDrawer open={this.state.timelineOrganizerDrawerToggle} 
  					toggleTimelineOrganizerCallback={this.toggleTimelineOrganizerDrawer} 
  				/>
  				<div id="main" style={{width: this.props.width}}>
  					<Appbar />
  					<Preview />
  				</div>
  				<TimelineNodeEditorDrawer open={this.state.timelineEditorDrawerToggle} 
  					toggleTimelineEditorCallback={this.toggleTimelineEditorDrawer} 
  				/>
  			</div>
  		);
	}
}

export default App;

