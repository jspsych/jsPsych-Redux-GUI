import GeneralTheme from '../theme.js';

const colors = {
	...GeneralTheme.colors,
	iconColor: 'white',
	hoverColor: '#B2FF59',
	highlightColor: '#B2FF59',
	background: '#24B24C', // green
}

export const AppbarIcon = {
	color: colors.iconColor,
	hoverColor: colors.hoverColor, 
}

const theme = {
	Appbar: {
		Appbar: {
			width: '100%',
			height: '100%',
			margin: '0 auto',
			borderBottom: '1px solid #aaa',
			display: 'flex',
			flexDirection: 'row',
			backgroundColor: colors.background,
		},
		DrawerToggle: {
			iconColor: AppbarIcon,
		},
		Toolbar: {
			display: 'flex',
			flexDirection: 'row',
			flexGrow: 1,
		},
		NameField: {
			inputStyle: {
				color: colors.font
			},
			underlineFocusStyle: {
				borderColor: colors.highlightColor
			}
		},
		text: {
			color: colors.font
		},
		icon: AppbarIcon
	},
	UserMenu: {
		icon: {
			color: colors.primary,
			hoverColor: colors.secondary,
		},
		avatar: {
			backgroundColor: 'white',
			color: colors.primary
		},
		username: {
			color: colors.font,
			fontWeight: 'bold',
			textDecoration: 'underline'
		}
	},
	InitEditor: {
		icon: AppbarIcon
	}
}


export default theme;