/*
Repeatedly used components

*/


import React from 'react';
import IconButton from 'material-ui/IconButton';
import Close from 'material-ui/svg-icons/navigation/close';
import {
	grey50 as dialogTitleColor,
	grey300 as CloseBackHighlightColor,
	grey50 as CloseDrawerHoverColor
} from 'material-ui/styles/colors';

export const renderDialogTitle = (messageNode=null, handleClose=()=>{}, titleColor=dialogTitleColor, style={}) => (
	<div style={{display: 'flex', backgroundColor: titleColor, ...style}}>
			{messageNode}
		<IconButton 
				hoveredStyle={{
					backgroundColor: CloseBackHighlightColor,
				}}
				onClick={handleClose}
			disableTouchRipple={true}
		>
		<Close hoverColor={CloseDrawerHoverColor} />
		</IconButton>
	</div>
)

const style = {
	FloatingLabelButtonContainer: {
		fontSize: '16px',
		lineHeight: '24px',
		width: '100%',
		height: '72px',
		display: 'inline-block',
		position: 'relative',
		backgroundColor: 'transparent',
		fontFamily: 'Roboto, sans-serif',
		cursor: 'auto',
	},
	FloatingLabelButtonLabel: {
		position: 'absolute',
		lineHeight: '22px',
		top: '38px',
		zIndex: '1',
		transform: 'scale(0.75) translate(0px, -28px)',
		transformOrigin: 'left top 0px',
		pointerEvents: 'none',
		userSelect: 'none',
		color: 'rgba(0, 0, 0, 0.3)',
		display: 'inline-block',
		maxWidth: '100%',
		marginBottom: '5px',
		fontWeight: '700',
	},
	FloatingLabelButton: {
		position: 'absolute',
		marginTop: '30px'
	}
}

export const FloatingLabelButton = ({labelText, button, rootStyle, buttonContainerStyle, labelStyle}) => (
	<div style={{
		...style.FloatingLabelButtonContainer,
		...rootStyle
	}}>
		<label style={{
			...style.FloatingLabelButtonLabel,
			...labelStyle
		}}>
			{labelText}
		</label>
		<div style={{
			...style.FloatingLabelButton,
			...buttonContainerStyle
		}}>
			{button}
		</div>
	</div>
)