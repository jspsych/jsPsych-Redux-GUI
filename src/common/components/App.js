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
			timelineEditorDrawerToggle: false,
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
  				<TimelineNodeOrganizerDrawer openTimelineEditorCallback={this.openTimelineEditorDrawer}/>
  				<div className="main-body" 
  					style={{width: convertPercent(this.props.width)}}
  				>
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

