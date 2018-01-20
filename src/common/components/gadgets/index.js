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

import GeneralTheme from '../theme.js';

const colors = {
	...GeneralTheme.colors,
	dividerColor: 'rgb(224, 224, 224)'
};

const style = {
	FloatingLabelButton: {
		root: {
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
		FloatingLabel: {
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
		ButtonGroup: {
			position: 'absolute',
			marginTop: '30px',
			width: '100%'
		},
		ButtonDescription: {
			color: colors.primaryDeep,
			fontSize: '13px',
			marginRight: '10px'
		},
		ButtonContainer: {
			display: 'flex',
			alignItems: 'flex-end',
			width: '100%',
			borderBottom: `1px solid ${colors.dividerColor}`
		}
	}
}

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

export const FloatingLabelButton = ({
		labelText,
		button,
		description,
		rootStyle,
		buttonContainerStyle,
		labelStyle,
		descriptionStyle,
		buttonGroupStyle
	}) => (
	<div style={{
		...rootStyle,
		...style.FloatingLabelButton.root
	}}>
		<label style={{
			...labelStyle,
			...style.FloatingLabelButton.FloatingLabel
		}}>
			{labelText}
		</label>
		<div style={{
			...buttonContainerStyle,
			...style.FloatingLabelButton.ButtonGroup
		}}>
			<div style={{
				...buttonGroupStyle,
				...style.FloatingLabelButton.ButtonContainer
			}}>
				<p style={{
					...style.FloatingLabelButton.ButtonDescription,
					...descriptionStyle,
				}}>
					{description}
				</p>
				{button}
			</div>
		</div>
	</div>
)