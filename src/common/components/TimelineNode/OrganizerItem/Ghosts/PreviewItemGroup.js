import React from 'react';

import PreviewOrganizerItem from '../../../../containers/TimelineNode/OrganizerItem/Ghosts/PreviewOrganizerItemContainer';

import { TREE_MENU_INDENT as INDENT } from '../../TimelineNodeOrganizerDrawer';

class PreviewItemGroup extends React.Component {
	
	render() {
		return (
			<div className="Organizer-Item-Group" style={{
				paddingLeft: INDENT * this.props.predictedLevel
			}}
			>
				{this.props.presentedIds.map((id) => (<PreviewOrganizerItem id={id} key={"Ghost-"+id} />))}
			</div>
		)
	}
}

export default PreviewItemGroup;


