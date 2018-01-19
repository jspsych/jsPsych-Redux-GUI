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
import GeneralTheme from '../theme.js';

export const WIDTH = 335;

const jsPsych = window.jsPsych;
const PluginList = Object.keys(jsPsych.plugins || {}).filter((t) => (t !== 'parameterType' && t !== 'universalPluginParameters'));

const colors = {
	...GeneralTheme.colors,
	labelColor: '#B1B1B1'
};
const style = {
	PluginSelectContainer: {
		display: 'flex',
		alignItems: 'baseline'
	},
	label: {
		color: colors.labelColor,
		marginRight: '15px',
		fontSize: '14px',
		fontFamily: 'Roboto, sans-serif'
	},
	TextFieldStyle: {
		...GeneralTheme.TextFieldFocusStyle
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
	}
}

export default class TimelineNodeEditorDrawer extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="TimelineNode-Editor"
					style={{
						width: (this.props.open) ? `${WIDTH}px` : '0px',
						flexBasis: 'auto',
						flexShrink: 0,
						'WebkitTransition': 'all 0.4s ease',
						'MozTransition': 'all 0.4s ease',
						transition: 'all 0.4s ease',
						}}>
				{this.props.open ?
		  				<div className="TimelineNode-Editor-Dragger">
			  				<div className="TimelineNode-Editor-Close-Handle-Container">
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
				  							width: 25,
				  							left: -5,
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
				

				<div className="TimelineNode-Editor-Container">
					{(this.props.open) ?
					<div className="TimelineNode-Editor-Content">
						<div className="TimelineNode-Editor-Header" 
							 style={{
							 	flexBasis: 'auto',
							 	height: (this.props.isTimeline) ? '60px' : '120px',
							 	minHeight: (this.props.isTimeline) ? '60px' : '120px',
							 }}
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
												{PluginList.map(
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
							<div className="TimelineNode-Editor-Sheet">
								<List style={{padding: 5, paddingTop: 0, width: '95%'}}>
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
