import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

var s = '<!doctype html>\
<html lang="en">\
  <head>\
    <meta charset="utf-8">\
    <meta name="viewport" content="width=device-width, initial-scale=1">\
    <script src="jsPsych/jspsych.js"></script>\
    <script src="jsPsych/plugins/jspsych-text.js"></script>\
    <script src="jsPsych/plugins/jspsych-single-stim.js"></script>\
    <link href="jsPsych/css/jspsych.css" rel="stylesheet" type="text/css"></link>\
    <script src="http://code.jquery.com/jquery-2.1.3.min.js"></script>\
    <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>\
  </head>\
  \
  <body class=\'canvas\'>\
    <div id="container"></div>\
  </body>\
  <script>var hello_trial = {\
        type: \'text\',\
        text: \'Hello world!\'\
    };\
    jsPsych.init({\
        timeline: [ hello_trial ]})</script>\
  <!-- <script src="/static/bundle.js"></script> -->\
</html>\
\
'

class Preview extends React.Component {
	constructor(props) {
		super(props);
	}


	render() {

		return (
  			<iframe srcDoc={s} disabled={true}/>   
  		);
	}
}

export default Preview;