import React from 'react';

import Preview from './Preview';
import Appbar from '../containers/Appbar';
import TimelineNodeOrganizerDrawer from '../containers/TimelineNode/TimelineNodeOrganizerDrawer';

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			timelineOrganizerDrawerToggle: true,
		}

		this.toggleTimelineOrganizerDrawer = () => {
			this.setState({
				timelineOrganizerDrawerToggle: !this.state.timelineOrganizerDrawerToggle,
			});
		}
	}

	render() {

		return (
  			<div className="main-container" style={{width: '100%', display: 'flex'}}>
  			<TimelineNodeOrganizerDrawer open={this.state.timelineOrganizerDrawerToggle}/>
  			<div id="main" style={{width: this.props.width}}>
  				<Appbar 
  					toggleTimelineOrganizerCallback={this.toggleTimelineOrganizerDrawer} 
  					timelineOrganizerDrawerToggle={this.state.timelineOrganizerDrawerToggle}
  					/></div>
  			</div>
  		);
	}
}

export default App;

