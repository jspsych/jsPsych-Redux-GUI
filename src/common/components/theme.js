import Prefixer from 'inline-style-prefixer';

const _prefixer = new Prefixer()

export const prefixer = (style={}, multiple=false) => {
	if (!multiple) return _prefixer.prefix(style);
	let res = {};
	for (let key of Object.keys(style)) {
		res[key] = _prefixer.prefix(style[key]);
	}
	return res;
}

const colors = {
	primary: '#24B24C', // green
	primaryDeep: '#04673A', // deep green
	secondary: '#FF9800', // orange
	background: '#F0F0F0', // grey
	secondaryDeep: '#FF5722',
	secondaryLight: '#FFB74D',
	font: 'white',
	errorRed: '#F34335'
};

const Icon = {
	color: colors.primary,
	hoverColor: colors.secondary
};

const TextFieldFocusStyle = (error=false) => ({
	floatingLabelFocusStyle: {
		color: error ? colors.errorRed : colors.secondary
	},
	underlineFocusStyle: {
		borderColor: error ? colors.errorRed : colors.secondary
	}
});

export default {
	colors: colors,
	Icon: Icon,
	TextFieldFocusStyle: TextFieldFocusStyle
};