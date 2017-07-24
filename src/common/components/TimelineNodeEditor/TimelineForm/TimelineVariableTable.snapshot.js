import React from 'react';
// import PropTypes from 'prop-types';
import ReactDataGrid from 'react-data-grid';
import Dialog from 'material-ui/Dialog';
// import FlatButton from 'material-ui/FlatButton';
// import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
// import { List } from 'material-ui/List';
// import Subheader from 'material-ui/Subheader';
import TextField from 'material-ui/TextField';
// import FloatingActionButton from 'material-ui/FloatingActionButton';

// import ObjectEditorIcon from 'material-ui/svg-icons/editor/mode-edit';
import {
  cyan500 as hoverColor,
} from 'material-ui/styles/colors';

import { ParameterMode } from '../../../reducers/Experiment/editor';
import CodeEditorTrigger from '../../CodeEditorTrigger';

/*
Remember to handle generating code for timeline variable if it is complexDataObject

*/

class HeaderCell extends React.Component {
	defaultProps = {
		name: "",

	}

	state = {
		edit: false
	}

	

	render() {

	}
}

class CustomEditor extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    	value: this.props.value,
    	open: false,
    }
  }

  getValue = () => {
    return {
      [this.props.column.key]: this.state.value
    };
  }

  checkFocus = () => {
  	this.setTextInputFocus();
  }

  getInputNode = () => {
    return this.refs.CustomEditorWrapper;
  }

  getStyle = () => {
    return {
      width: '100%'
    };
  }

  inheritContainerStyles() {
    return true;
  }

  handleOpen = () => {
  	this.setState({
  		open: true
  	})
  }

  handleClose = () => {
  	this.setState({
  		open: false
  	})
  }
  
  onBlur = () => {
  	if (!this.state.open) {
  		this.props.onBlur();
  	} else {
  		console.log(1);
  	}
  }

  setToFunc = () => {
  	this.setState({
  		value: Object.assign({}, this.state.value, {
  			mode: (this.state.value.mode === ParameterMode.USE_FUNC) ? null : ParameterMode.USE_FUNC
  		})
  	});
  }

  setCode = (code) => {
  	this.setState({
  		value: Object.assign({}, this.state.value, {
  			func: Object.assign({}, this.state.value.func, {
  				code: code
  			})
  		})
  	});
  }

  setValue = (v) => {
  	this.setState({
  		value: Object.assign({}, this.state.value, {
  			value: v
  		})
  	});
  }

  render() {
  	let { value } = this.state;
    return(
      <div>
        <div ref="CustomEditorWrapper" style={{display: 'flex', marign: 'auto'}} onBlur={this.onBlur}>
          {(value.mode === ParameterMode.USE_FUNC) ?
          	<MenuItem primaryText="[Function]" disabled={true} /> :
          	<TextField 
          		id="Timeline-Variable-Table-Editor"
          		value={(value.value === null) ? "" : value.value}
          		onChange={(e, v) => {
          			this.setValue(v);
          		}}
          	/>
          }
          <CodeEditorTrigger
  			setParamMode={this.setToFunc}
			useFunc={value.mode === ParameterMode.USE_FUNC}
			showEditMode={true}
			initCode={value.func.code}
			submitCallback={this.setCode}
			openCallback={this.handleOpen}
			closeCallback={this.handleClose}
  			/>
        </div>
      </div>
    )
  }
}

CustomEditor.propTypes = {
  value: React.PropTypes.object.isRequired,
  column: React.PropTypes.shape({
    key: React.PropTypes.string.isRequired
  }).isRequired
}

class GridCell extends React.Component {
	render() {
		let { value: complextDataObject } = this.props;
		switch(complextDataObject.mode) {
			case ParameterMode.USE_FUNC:
				return <MenuItem primaryText="[Function]" disabled={true}/>;
			default:
				return <MenuItem primaryText={complextDataObject.value} disabled={true}/>;
		}
	}
}

export function createDataGridRows(timelineVariable) {
	return timelineVariable.map((row) => {
		let strRow = {};
		for (let key of Object.keys(row)) {
			strRow[key] = (row[key] === null) ? "" : row[key];
		}
		return strRow;
	})
}

// <TextField id="sda" value="ID" style={{maxHeight: 35}}/>
export default class TimelineVariableTable extends React.Component {
	constructor(props) {
		super(props);
	}

	rowGetter = (i) => {
		return this.props.rows[i];
	}

	handleGridRowsUpdated = ({ fromRow, toRow, updated }) => {
		this.props.updateTimelineVariableRow(fromRow, toRow, updated);
	}

	createDataGridColumn = () => {
		let columns = [];
		let { timeline_variables } = this.props;
		if (timeline_variables.length < 1) return columns;

		// since in jspsych data form, rows are objects with
		// same keys but possibly different values (see reducers/editor for detailed explanation)
		let sampleRowObject = timeline_variables[0];
		// generate table columns
		for (let key of Object.keys(sampleRowObject)) {
			columns.push({
				key: key,
				name: key,
				resizable: true,
				editable: true,
				editor: CustomEditor,
				formatter: GridCell
			})
		}

		return columns;
	}


	render() {
		return (
	      <ReactDataGrid
	        enableCellSelect={true}
	        columns={this.createDataGridColumn()}
	        rowGetter={this.rowGetter}
	        rowsCount={this.props.rows.length}
	        minHeight={300}
	        minColumnWidth={120} 
	        headerRowHeight={52}
	        rowHeight={52}
	        onGridRowsUpdated={this.handleGridRowsUpdated}
	      />
		 )
	}
}
