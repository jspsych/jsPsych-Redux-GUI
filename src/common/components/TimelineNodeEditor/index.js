import React from 'react';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import { List } from 'material-ui/List';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

import CloseDrawerHandle from 'material-ui/svg-icons/navigation/chevron-right';
import OpenDrawer from 'material-ui/svg-icons/navigation/chevron-left';
import {
	grey300 as popDrawerColor,
	grey400 as DrawerHandleColor,
	grey300 as CloseBackHighlightColor,
	grey50 as CloseDrawerHoverColor
} from 'material-ui/styles/colors';

import TrialForm from '../../containers/TimelineNodeEditor/TrialForm';
import TimelineForm from '../../containers/TimelineNodeEditor/TimelineForm';

import './TimelineNodeEditor.css';
import GeneralTheme, { prefixer } from '../theme.js';

export const WIDTH = 335;

const jsPsych = window.jsPsych;
const PluginList = Object.keys(jsPsych.plugins || {}).filter((t) => (t !== 'parameterType' && t !== 'universalPluginParameters'));

const colors = {
	...GeneralTheme.colors,
	labelColor: '#B1B1B1'
};
const style = {
	PluginSelectContainer: prefixer({
		display: 'flex',
		alignItems: 'flex-start'
	}),
	label: prefixer({
		color: colors.labelColor,
		marginRight: '15px',
		fontSize: '14px',
		fontFamily: 'Roboto, sans-serif'
	}),
	TextFieldStyle: {
		...GeneralTheme.TextFieldFocusStyle()
	},
	SelectFieldStyle: {
		autoWidth: true,
		fullWidth: true,
		maxHeight: 300,
		// floatingLabelText: "Plugin",
		// floatingLabelFixed: true,
		selectedMenuItemStyle: {
			color: colors.secondary
		},
		underlineFocusStyle: {
			color: colors.secondary
		}
	},
	TimelineNodeEditor: open => (prefixer({
		width: (open) ? `${WIDTH}px` : '0px',
		flexBasis: 'auto',
		flexShrink: 0,
		transition: 'all 0.4s ease',
		height: '100%',
		display: 'flex',
		overflow: 'hidden',
		flexDirection: 'row',
		zIndex: '4',
		boxShadow: '0 2px 5px rgba(0,0,0, .26)'
	})),
	TimelineNodeEditorContainer: prefixer({
		height: '100%',
		width: '100%',
		position: 'relative',
		flexGrow: '1',
		display: 'flex',
		flexDirection: 'column',
	}),
	TimelineNodeEditorContent: prefixer({
		height: '100%',
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
	}),
	TimelineNodeEditorHeader: isTimeline => (prefixer({
		flexBasis: 'auto',
		height: (isTimeline) ? '60px' : '130px',
		minHeight: (isTimeline) ? '60px' : '130px',
		alignItems: 'center',
		display: 'flex',
		width: '95%',
	})),
	TimelineNodeEditorSheet: {
		root: prefixer({
			overflowY: 'auto',
			overflowX: 'auto',
			flexGrow: '1',
		}),
		List: prefixer({
			padding: 5,
			paddingTop: 0,
			width: '95%'
		})
	},
	TimelineNodeEditorDragger: prefixer({
		height: '100%',
		width: '8px',
		minWidth: '8px',
		flexBasis: '8px',
		// cursor: 'col-resize',
	}),
	TimelineNodeEditorCloseHandleContainer: prefixer({
		display: 'none',
	    top: '50%',
	    position: 'fixed',
	}),
	TimelineNodeEditorCloseHandle: prefixer({
		width: 25,
		left: -5,
	})
}

export default class TimelineNodeEditorDrawer extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="TimelineNode-Editor"
					style={{...style.TimelineNodeEditor(this.props.open),}}>
				{this.props.open ?
		  				<div className="TimelineNode-Editor-Dragger" style={{...style.TimelineNodeEditorDragger}}>
			  				<div className="TimelineNode-Editor-Close-Handle-Container" 
			  					 style={{...style.TimelineNodeEditorCloseHandleContainer}}
			  				>
			  						<IconButton
			  							className="TimelineNode-Editor-Close-Handle"
			  							tooltip="Close"
			  							tooltipPosition="bottom-left"
			  							hoveredStyle={{
						  					left: 0,
				  							width: 26.5,
			  								backgroundColor: CloseBackHighlightColor
			  							}}
			  							style={{
			  							}}
			  							iconStyle={{
			  								margin: '0px 0px 0px -12px'
			  							}}
			  							disableTouchRipple={true}
										onClick={this.props.closeTimelineEditorCallback}
			  							>
			  							<CloseDrawerHandle />
			  						</IconButton>
			  					</div>
			  			</div> :
		  			null
				}
				

				<div className="TimelineNode-Editor-Container" style={{...style.TimelineNodeEditorContainer}}>
					{(this.props.open) ?
					<div className="TimelineNode-Editor-Content" style={{...style.TimelineNodeEditorContent}}>
						<div className="TimelineNode-Editor-Header" 
							 style={{...style.TimelineNodeEditorHeader(this.props.isTimeline),}}
						>
							<Subheader >
							{(this.props.previewId) ?
								<div>
									<TextField
											floatingLabelText={this.props.label}
											id="Node-Name-Textfield"
			                				value={this.props.nodeName}
			                				fullWidth={true}
			                				{...style.TextFieldStyle}
											onChange={this.props.changeNodeName} />
									{!this.props.isTimeline ?
										<div style={style.PluginSelectContainer}>
											<p style={style.label}>Plugin: </p>
											<SelectField
												{...style.SelectFieldStyle}
												value={this.props.pluginType}
												title={this.props.pluginType}
												onChange={(event, key) => this.props.changePlugin(PluginList[key])} 
											>
												{PluginList && PluginList.map(
													(plugin) => (
														<MenuItem primaryText={plugin} key={plugin+"-Item-Name"} value={plugin} />
														)
													)
												}
											</SelectField>
										</div>:
										null
								    }
								</div>
								: null
							}
							</Subheader>
						</div>
						<Divider />
						{(this.props.previewId) ?
							<div className="TimelineNode-Editor-Sheet" style={{...style.TimelineNodeEditorSheet.root}}>
								<List style={{...style.TimelineNodeEditorSheet.List}}>
									{this.props.isTimeline ?
										<TimelineForm id={this.props.previewId} /> :
										<TrialForm id={this.props.previewId} pluginType={this.props.pluginType} />
									}

								</List> 
							</div> :
						null}
					</div> : 
					null}
				</div>
  				{(this.props.open) ? null :
  					<IconButton
  						className="TimelineNode-Editor-Handle"
  						tooltip="Open Timeline/Trial Editor"
  						hoveredStyle={{
  							backgroundColor: DrawerHandleColor,
  							right: 0,
  						}}
  						onClick={this.props.openTimelineEditorCallback}
  						tooltipPosition="bottom-left"
  						style={{
	  					position: 'fixed',
	  					right: -8,
	  					top: '50%',
	  					width: 25,
	  					backgroundColor: popDrawerColor,
	  					padding: '12px 0',
	  					zIndex: 1,
  				}}><OpenDrawer /></IconButton>}
  			</div>
  			)
	}
}
