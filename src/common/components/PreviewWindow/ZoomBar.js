import React from 'react';
import { getFullScreenState } from './index';
import {
  grey600 as textColor
} from 'material-ui/styles/colors';

const responsiveTextFieldStyle = {
	maxWidth: 40,
	minWidth: 40,
	height: 22.8,
	// border: 'none',
	// borderBottom: '1px solid black',
	// backgroundColor: 'rgb(232, 232, 232)',
	outline: 'none',
	color: textColor,
	textAlign: 'center'
};

export default class ZoomBar extends React.Component {
	static defaultProps = {
		zoomHeightByUser: 0,
		zoomWidthByUser: 0
	}

	render() {
		const {
			zoomScale,
			zoomWidthByUser,
			zoomHeightByUser,
			onInputZoomHeight,
			onInputZoomWidth,
			setZoomHeight,
			setZoomWidth,
			onSelect,
		} = this.props;
		return (
			<div style={{
	  					width:"90%", 
	  					margin: '0 auto', 
	  				}}
	  				>
	  				<span style={{
	  					paddingTop: 5,
	  					paddingBottom: 5,
	  					// paddingLeft: 3,
	  					display: 'flex', 
	  					// width: 185,
	  					// margin: '0 auto',
	  					// backgroundColor: 'rgb(232, 232, 232)'
	  				}}>	
			              <input 
			                className="Responsive-input" 
			                id="Responsive-input-Width"
			                style={responsiveTextFieldStyle} 
			                title={"width: " + zoomWidthByUser + "px"}
			                type='number'
			                value={zoomWidthByUser}
			                onChange={onInputZoomWidth}
			                onKeyPress={setZoomWidth}
			                onBlur={() => { let e = {which: 13}; setZoomWidth(e) }}
			              />
			              <div style={{
			              	paddingLeft: 8, 
			              	paddingRight: 8, 
			              	color: (getFullScreenState()) ? 'white' : textColor,
			              }}>x</div>
			              <input 
			                className="Responsive-input" 
			                id="Responsive-input-Height"
			                style={responsiveTextFieldStyle} 
			                title={"height: " + zoomHeightByUser + "px"}
			                type='number'
			                value={zoomHeightByUser}
			                onChange={onInputZoomHeight}
			                onKeyPress={setZoomHeight}
			                onBlur={() => { let e = {which: 13}; setZoomHeight(e) }}
			              />
			              <div style={{paddingLeft: 16}}>
			                <select value={-1} 
			                        style={{
			                          outline: 'none', 
			                          color: textColor, 
			                          height: 22.8,
			                        }} 
			                        title={"Zoom: " + Math.round(zoomScale * 100) + '%'}
			                        onChange={onSelect}
			                >
			                  <option value={-1}>{Math.round(zoomScale * 100) + '%'}</option>
			                  <option value={0}>25%</option>
			                  <option value={1}>50%</option>
			                  <option value={2}>75%</option>
			                  <option value={3}>100%</option>
			                  <option value={4}>125%</option>
			                  <option value={5}>150%</option>
			                </select>
			              </div>
			        	</span>
			        </div>
		)
	}
}