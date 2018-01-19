
const colors = {
	primary: '#24B24C', // green
	primaryDeep: '#04673A', // deep green
	secondary: '#FF9800', // orange
	background: '#F0F0F0', // grey
	secondaryDeep: '#FF5722',
	secondaryLight: '#FFB74D',
	font: 'white',
};

const Icon = {
	color: colors.primary,
	hoverColor: colors.secondary
};

const TextFieldFocusStyle = {
	floatingLabelFocusStyle: {
		color: colors.secondary
	},
	underlineFocusStyle: {
		borderColor: colors.secondary
	}
};

export default {
	colors: colors,
	Icon: Icon,
	TextFieldFocusStyle: TextFieldFocusStyle
};