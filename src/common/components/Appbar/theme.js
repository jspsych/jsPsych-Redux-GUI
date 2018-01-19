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
				borderColor: colors.primaryDeep
			}
		},
		text: {
			color: colors.font
		},
		icon: AppbarIcon
	},
	UserMenu: {
		icon: {
			hoverColor: colors.secondaryLight,
			color: colors.secondary,
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
	},
	ExperimentList: {
		moreIcon: {
			color: 'black',
			hoverColor: 'F0F0F0'
		},
		duplicateIcon: {
			color: '#673AB7'
		},
		deleteIcon: {
			color: '#E82062'
		},
		avatar: {
			backgroundColor: colors.primaryDeep
		},
		progress: {
			color: colors.primary
		},
		ListItem: {
			selected: '#E2E2E2'
		},
		dialogTitleIcon: {
			color: colors.primaryDeep
		},
		dialogBody: {
			backgroundColor: '#F4F4F4'
		},
		actionButton: {
			color: colors.primaryDeep
		}
	},
}


export default theme;