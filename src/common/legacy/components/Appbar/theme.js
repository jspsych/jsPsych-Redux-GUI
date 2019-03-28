import GeneralTheme from '../theme.js';

export const colors = {
	...GeneralTheme.colors,
	iconColor: 'white',
	hoverColor: '#B2FF59',
	highlightColor: '#B2FF59',
	background: '#24B24C', // green
}

export const AppbarIcon = {
	color: colors.iconColor,
	hoverColor: colors.primaryDeep, 
}

const theme = {
	...GeneralTheme,
	colors: colors,
	AppbarIcon: AppbarIcon,
}

export default theme;