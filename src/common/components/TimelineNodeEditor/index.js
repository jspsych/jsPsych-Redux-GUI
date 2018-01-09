import React from 'react';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import { List } from 'material-ui/List';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

import Draggable from 'react-draggable';

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
import { convertPercent } from '../App';

export const MIN_WIDTH = 25;
const MAX_WIDTH = 50;

const jsPsych = window.jsPsych;
const PluginList = Object.keys(jsPsych.plugins).filter((t) => (t !== 'parameterType' && t !== 'universalPluginParameters'));

const enableAnimation = (flag) => ((flag) ? 'none' : 'all 0.4s ease');

const getWidthFromDragging = (e) => {
	let percent = (1 - (e.pageX / window.innerWidth)) * 100;
	if (percent < MIN_WIDTH) percent = MIN_WIDTH;
	if (percent > MAX_WIDTH) percent = MAX_WIDTH;
	return percent;
}

function pauseEvent(e){
    if(e.stopPropagation) e.stopPropagation();
    if(e.preventDefault) e.preventDefault();
    e.cancelBubble=true;
    e.returnValue=false;
    return false;
}

export default class TimelineNodeEditorDrawer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			dragging: false,
		}

		this.onDragStart = (e) => {
			this.setState({
				dragging: true,
			});
		}

		this.onDragEnd = (e) => {
			this.setState({
				dragging: false,
			});
		}

		this.onDrag = (e) => {
			this.props.setWidthCallback(getWidthFromDragging(e));
			pauseEvent(e)
		}

	}

	render() {
		return (
			<div className="TimelineNode-Editor"
					style={{width: (this.props.open) ? convertPercent(this.props.width) : '0%',
						right: '0px',
						height: '100%',
						display: 'flex',
						'WebkitTransition': enableAnimation(this.state.dragging),
						'MozTransition': enableAnimation(this.state.dragging),
						transition: enableAnimation(this.state.dragging),
						}}>
				<Draggable
				        axis="x"
				        handle=".TimelineNode-Editor-Dragger"
				        zIndex={10}
				        position={{x: this.props.width}}
				        onStart={this.onDragStart}
				        onDrag={this.onDrag}
				        onStop={this.onDragEnd}
				        >
	  				<div 	className="TimelineNode-Editor-Dragger"
	  						style={{
	  							   position: 'fixed',
								   height:'100%',
								   width: '10px',
								   cursor: 'col-resize',
								   display: 'inline-block',
	  							}}
	  				>
		  				<div className="TimelineNode-Editor-Close-Handle-Container"
	  							 style={{
	  							 		top: "50%",
	  							 		position: "fixed"
		  							}}
	  						>
		  						<IconButton
		  							className="TimelineNode-Editor-Close-Handle"
		  							tooltip="Close"
		  							tooltipPosition="bottom-left"
		  							hoveredStyle={{
		  								left: 1,
			  							width: 26.5,
		  								backgroundColor: CloseBackHighlightColor
		  							}}
		  							style={{
			  							left: -9,
			  							width: 25,
					  					zIndex: 1
		  							}}
		  							iconStyle={{
					  					margin:"0px 0px 0px -8px"
		  							}}
		  							disableTouchRipple={true}
									onTouchTap={this.props.closeTimelineEditorCallback}
		  							>
		  							<CloseDrawerHandle />
		  						</IconButton>
		  					</div>
		  			</div>
	  			</Draggable>

				<div className="TimelineNode-Editor-Container"
					style={{
						height: '100%',
						width: '100%',
						borderLeft: (this.props.open) ? '1px solid #aaa' : '1px solid #aaa'
					}}>
					{(this.props.open) ?
					<div className="TimelineNode-Editor-Content">
						<div style={{display: 'flex', height: '100%', width: '95%'}}>
							<Subheader >
							{(this.props.previewId) ?
								<div>
									<TextField
											floatingLabelText={this.props.label}
											id="Node-Name-Textfield"
			                				value={this.props.nodeName}
			                				fullWidth={true}
											onChange={this.props.changeNodeName} />
									{(!this.props.isTimeline) ?
									<div style={{display: 'flex', width: "100%"}}>
										<p style={{display: 'inline-block', paddingRight: 15}}>
												{"Plugin:"}
											</p>
										<div style={{display: 'inline-block', width: "100%"}}>
											<SelectField
												fullWidth={true}
												value={this.props.pluginType}
												title={this.props.pluginType}
												maxHeight={300}
												onChange={(event, key) => this.props.changePlugin(PluginList[key])} 
											>
											{PluginList.map((plugin) => (<MenuItem primaryText={plugin} key={plugin+"-Item-Name"} value={plugin} />))}
											</SelectField>
										</div>
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
							<Paper style={{
								padding: 5, 
								overflowY: 'auto', 
								overflowX: 'scroll',
								maxHeight: 455, 
								minHeight: 455,
								paddingTop: 0
							}} 
								zDepth={0}
							>
								<List style={{padding: 5, paddingTop: 0, width: '95%'}}>
									{this.props.isTimeline ?
										<TimelineForm id={this.props.previewId} /> :
										<TrialForm id={this.props.previewId} pluginType={this.props.pluginType} />
									}

								</List> 
							</Paper> :
						null}
					</div> : 
					null}
					{/* <Divider /> */}
				</div>
  				{(this.props.open) ? null :
  					<IconButton
  						className="TimelineNode-Editor-Handle"
  						tooltip="Open Timeline/Trial Editor"
  						hoveredStyle={{
  							backgroundColor: DrawerHandleColor,
  							right: 0,
  						}}
  						onTouchTap={this.props.openTimelineEditorCallback}
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
