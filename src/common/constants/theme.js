const colors = {
	primary: '#24B24C', // green
	primaryDeep: '#04673A', // deep green
	secondary: '#FF9800', // orange
	background: '#F0F0F0', // grey
	secondaryDeep: '#FF5722',
	secondaryLight: '#FFB74D',
	font: 'white',
	errorRed: '#F34335',
	defaultFontColor: '#424242',
};

const Icon = {
	color: colors.primary,
	hoverColor: colors.secondary
};

const TextFieldFocusStyle = (error = false) => {
	var res = {
		floatingLabelFocusStyle: {
			color: error ? colors.errorRed : colors.secondary
		},
		underlineFocusStyle: {
			borderColor: error ? colors.errorRed : colors.secondary
		}
	}

	if (error) {
		res.floatingLabelStyle = {
			color: colors.errorRed
		}
	}

	return res;
};

export {
	colors,
	Icon,
	TextFieldFocusStyle
};