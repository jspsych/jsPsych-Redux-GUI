import GeneralTheme from '../../theme.js';


const colors = {
	...GeneralTheme.colors,
	deepGrey: '#424242'
}

export const INDENT = 32;

export const colorSelector = (hovered, isSelected) => {
	if (hovered) return null;
	if (isSelected) return '#E3E3E3'
	return null;
}

export const listItemStyle = (isEnabled, isSelected) => ({
	color: isEnabled ? colors.deepGrey : 'grey',
	fontWeight: isSelected ? 'bold' : 'normal',
})

const iconColorSelector = (isEnabled, isSelected) => {
	if (isSelected) return colors.secondary; // deep orange
	return isEnabled ? '#616161' : 'grey';
}

const theme = {
	collpaseButtonHoverStyle: {
		backgroundColor: '#CDCDCD'
	},
	icon: (isEnabled, isSelected) => ({
		color: iconColorSelector(isEnabled, isSelected),
		hoverColor: colors.secondaryLight,
	}),
	contextMenuStyle: {
		outerDiv: {
			position: 'absolute',
			zIndex: 20
		},
		innerDiv: {
			backgroundColor: '#F5F5F5',
			borderBottom: '1px solid #BDBDBD'
		},
		lastInnerDiv: {
			backgroundColor: '#F5F5F5'
		},
		iconColor: colors.secondaryDeep,
	}
}


export default theme;