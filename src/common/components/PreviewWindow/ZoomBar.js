import React from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { getFullScreenState } from './index';
import GeneralTheme from '../theme.js';

const colors = GeneralTheme.colors;
const TextFieldWidth = 80;
const SelectFieldWidth = 120;
const style = {
	Zoombar: {
		margin: '0 auto',
		flexBasis: '72px',
		display: 'flex',
		alignItems: 'center',
		flexShrink: 0,
	},
	TextFieldContainer: {
		display: 'flex',
		alignItems: 'baseline',
		paddingRight: '16px'
	},
	TextFieldStyle: {
		style: {
			maxWidth: `${TextFieldWidth}px`,
			minWidth: `${TextFieldWidth}px`,
		},
		inputStyle: {
			textAlign: 'center'
		},
		floatingLabelStyle: {
			// color: 'black'
		},
		floatingLabelFocusStyle: {
			color: colors.secondary
		},
		underlineStyle: {
			// borderColor: 'black'
		},
		underlineFocusStyle: {
			borderColor: colors.secondary
		}
	},
	X: {
		paddingLeft: 8,
		paddingRight: 8,
		fontSize: '14px',
		color: 'black',
	},
	SelectFieldStyle: {
		style: {
			maxWidth: `${SelectFieldWidth}px`,
			minWidth: `${SelectFieldWidth}px`,
		},
		autoWidth: true,
		floatingLabelText: "Zoom",
		floatingLabelFixed: true,
		selectedMenuItemStyle: {
			color: colors.secondary
		},
		underlineFocusStyle: {
			color: colors.secondary
		}
	}
}

export default class ZoomBar extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {
			zoomScale,
			displayZoom,
			zoomWidthByUser,
			zoomHeightByUser,
			onInputZoomHeight,
			onInputZoomWidth,
			setZoomHeight,
			setZoomWidth,
			setDisplayZoom,
		} = this.props;

		let zoomVal = Math.round(zoomScale * 100);

		return (
			<div style={style.Zoombar}>
				<div style={style.TextFieldContainer}>
					<TextField
						{...style.TextFieldStyle}
						id="Responsive-input-Width"
						type="number"
						floatingLabelText="Width"
						floatingLabelFixed={true}
						title={`width: ${zoomWidthByUser}px`}
						value={zoomWidthByUser || ""}
						onChange={onInputZoomWidth}
		                onKeyPress={setZoomWidth}
		                onBlur={() => { let e = {which: 13}; setZoomWidth(e) }}
					/>
					<div style={style.X}
		            >
		              x
		            </div>
					<TextField
						{...style.TextFieldStyle}
						id="Responsive-input-Height"
						type="number"
						floatingLabelText="Height"
						floatingLabelFixed={true}
						title={`height: ${zoomHeightByUser}px`}
						value={zoomHeightByUser || ""}
				        onChange={onInputZoomHeight}
				        onKeyPress={setZoomHeight}
				        onBlur={() => { let e = {which: 13}; setZoomHeight(e) }}
					/>
				</div>
	            <SelectField 
	            	{...style.SelectFieldStyle}
	            	value={displayZoom} 
	            	title={`Zoom: ${zoomVal}%`}
	            	onChange={(e, i, v) => { setDisplayZoom(e, i, v); }}
	                >
	                  <MenuItem primaryText={`${zoomVal}%`} value={-1} />
	                  <MenuItem primaryText={`25%`} value={0.25} />
	                  <MenuItem primaryText={`50%`} value={0.5} />
	                  <MenuItem primaryText={`75%`} value={0.75} />
	                  <MenuItem primaryText={`100%`} value={1} />
	                  <MenuItem primaryText={`125%`} value={1.25} />
	                  <MenuItem primaryText={`150%`} value={1.5} />
	            </SelectField>
		</div>
		)
	}
}