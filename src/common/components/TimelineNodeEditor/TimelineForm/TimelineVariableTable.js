import React from 'react';
// import PropTypes from 'prop-types';
import ReactDataGrid from 'react-data-grid';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
// import { List } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import TextField from 'material-ui/TextField';
// import FloatingActionButton from 'material-ui/FloatingActionButton';

// import ObjectEditorIcon from 'material-ui/svg-icons/editor/mode-edit';
import Uncheck from 'material-ui/svg-icons/toggle/star-border';
import Check from 'material-ui/svg-icons/toggle/star';
import CodeButtonIcon from 'material-ui/svg-icons/action/code';
import {
  cyan500 as hoverColor,
  yellow500 as checkColor,
} from 'material-ui/styles/colors';

import { ParameterMode } from '../../../reducers/Experiment/editor';
const { Menu: { ContextMenu, MenuItem: ContextmenuItem, SubMenu } } = require('react-data-grid-addons');
import CodeMirror from 'react-codemirror';
require('codemirror/lib/codemirror.css');
import { renderDialogTitle } from '../../gadgets';


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

class MyContextMenu extends React.Component {
	
	setEdittingCell = () => {
		this.props.setEdittingCell({
			row: this.props.rowIdx,
			col: this.props.idx
		})
	}

	render() {
	    return (
	    	<ContextMenu >
	    		<ContextmenuItem onClick={this.setEdittingCell}>
	    			<MenuItem primaryText="Insert code" rightIcon={<CodeButtonIcon hoverColor={hoverColor} />} />
	    		</ContextmenuItem>
		   	</ContextMenu>
	    );
	  }
}

class CustomEditor extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    	value: this.props.value,
    }
  }

  getValue = () => {
    return {
      [this.props.column.key]: this.state.value
    };
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

  setValue = (v) => {
  	this.setState({
  		value: Object.assign({}, this.state.value, {
  			value: v
  		})
  	});
  }

  render() {
  	let { value } = this.state;
    return (
      <div>
        <div ref="CustomEditorWrapper">
          {(value.mode === ParameterMode.USE_FUNC) ?
          	<div style={{width: "80%"}}>
	          	<TextField 
	          		title="[Custom Code]" 
	          		fullWidth={true}
	          		style={{paddingLeft: "10%", height: 34,}}
	          		inputStyle={{color: 'rgba(0, 0, 0, 0.3)', textAlign: 'center', fontSize: 14}}
	          		id="Timeline-Variable-Table-Editor"
	          		value="[Custom Code]" 
	          		underlineShow={false}
	          		disabled={true}
	          	/>
          	</div> :
          	<div style={{width: "80%",}}>
	          	<TextField 
	          		title={(value.value === null) ? "" : value.value}
	          		fullWidth={true}
	          		style={{paddingLeft: "10%", height: 34}}
	          		id="Timeline-Variable-Table-Editor"
	          		value={(value.value === null) ? "" : value.value}
	          		onChange={(e, v) => {
	          			this.setValue(v);
	          		}}
	          	/>
          	</div>
          }
        </div>
      </div>
    )
  }
}

class GridCell extends React.Component {
	render() {
		let { value: complextDataObject } = this.props;
		switch(complextDataObject.mode) {
			case ParameterMode.USE_FUNC:
				return <div 
							title="[Custom Code]" 
							style={{color: 'rgba(0, 0, 0, 0.3)', textAlign: 'center'}}
						>
							[Custom Code]
						</div>;
			default:
				return <div title={complextDataObject.value}>{complextDataObject.value}</div>;
		}
	}
}

class CodeEditor extends React.Component {
	state = {
		code: "",
	}

	componentDidMount() {
		this.setState({
			code: (this.props.code === null) ? "" : this.props.code
		})
	}

	onUpdate = (newCode) => {
		this.setState({
			code: newCode
		});
	}

	render() {
		let {
			open,
			handleClose,
			setParamMode,
			useFunc,
			setCode,
		} = this.props;

		const actions = [
	      <FlatButton
	        label="Finish"
	        primary={true}
	        onTouchTap={() => { setCode(this.state.code); handleClose() }}
	      />,
	    ];

		return (
			<Dialog
	      		contentStyle={{minHeight: 500}}
              	titleStyle={{padding: 0}}
	            title={renderDialogTitle(
                <Subheader style={{fontSize: 18, maxHeight: 48}}>
                Code Editor
                </Subheader>, 
                handleClose, 
                null)}
	            actions={actions}
	            modal={true}
	            open={open}
	            onRequestClose={handleClose}
	      	>
              <div style={{display: 'flex'}}>
              <p style={{paddingTop: 15, color: (useFunc) ? 'blue' : 'black'}}>
                Use Custom Code:
              </p>
              <IconButton
                onTouchTap={setParamMode}
                >
                {(useFunc) ? <Check color={checkColor} /> : <Uncheck />}
                </IconButton>
              </div>
	          <CodeMirror 
      			value={this.state.code} 
                onChange={this.onUpdate} 
                options={{lineNumbers: true}}
              />
	      	</Dialog>
		)
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

export default class TimelineVariableTable extends React.Component {
	state = {
		open: false,
		edittingCell: null
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

	setEdittingCell = (data) => {
		this.setState({
			edittingCell: data,
			open: true,
		})
	}

	handleCloseCodeEditor = () => {
		this.setState({
			open: false,
			edittingCell: null
		})
	}

	render() {
	    let chosenCol, chosenCell;
		if (this.state.edittingCell) {
			let { row, col } = this.state.edittingCell;
	    	chosenCol = Object.keys(this.props.timeline_variables[0])[col];
	    	chosenCell = this.props.timeline_variables[row][chosenCol];
		}

		return (
		  <div style={{maxHeight: 300, width: "100%"}}>
		     <ReactDataGrid
		        enableCellSelect={true}
		        contextMenu={
		        	<MyContextMenu 
		        		onRowDelete={this.deleteRow} 
		        		onRowInsertAbove={this.insertRowAbove} 
		        		onRowInsertBelow={this.insertRowBelow}
		        		setEdittingCell={this.setEdittingCell} 
		        	/>
		        }
		        columns={this.createDataGridColumn()}
		        rowGetter={this.rowGetter}
		        rowsCount={this.props.rows.length}
		        minHeight={250}
		        minColumnWidth={120} 
		        onGridRowsUpdated={this.handleGridRowsUpdated}
		      />
	      	  {(this.state.edittingCell !== null) ?
	      	  	<CodeEditor
	      	  		open={this.state.open}
	      	  		code={chosenCell.func.code}
	      	  		useFunc={chosenCell.mode === ParameterMode.USE_FUNC}
	      	  		handleClose={this.handleCloseCodeEditor}
	      	  		setParamMode={() => {
	      	  			let { row, col } = this.state.edittingCell;
	      	  			this.props.setParamMode(row, col);
	      	  		}}
	      	  		setCode={(code) => {
	      	  			let { row, col } = this.state.edittingCell;
	      	  			this.props.setCode(row, col, code);
	      	  		}}
	      	  	/> :
	      	  	null
	      	  }
	      </div>
		 )
	}
}

// class CustomEditor extends React.Component {
//   constructor(props){
//     super(props);
//     this.state = {
//     	value: this.props.value,
//     }
//   }

//   getValue = () => {
//     return {
//       [this.props.column.key]: this.state.value
//     };
//   }

//   getInputNode = () => {
//     return this.refs.CustomEditorWrapper;
//   }

//   getStyle = () => {
//     return {
//       width: '100%'
//     };
//   }

//   inheritContainerStyles() {
//     return true;
//   }

//   handleOpen = () => {
//   	this.setState({
//   		open: true
//   	})
//   }

//   handleClose = () => {
//   	this.setState({
//   		open: false
//   	})
//   }

//   setValue = (v) => {
//   	this.setState({
//   		value: Object.assign({}, this.state.value, {
//   			value: v
//   		})
//   	});
//   }

//   setParamMode = () => {
//   	this.setState({
//   		value: Object.assign({}, this.state.value, {
//   			mode: this.state.value.mode === ParameterMode.USE_FUNC ? null : ParameterMode.USE_FUNC
//   		})
//   	});
//   }

//   render() {
//   	let { value } = this.state;
//   	let Toggle = (
//   		<IconButton
//           	tooltip="Use custom code"
//           	onTouchTap={this.setParamMode}
//           >
//           	{(this.state.value.mode === ParameterMode.USE_FUNC) ? <Check color={checkColor} /> : <Uncheck />}
//           </IconButton>
//   	)

//     return (
//       <div>
//         <div ref="CustomEditorWrapper" style={{display: 'flex'}}>
//           {(value.mode === ParameterMode.USE_FUNC) ?
//           	<ListItem 
//           		primaryText="[Custom Code]" 
//           		disabled={true} 
//           		rightIconButton={Toggle}
//           		style={{color: 'rgba(0, 0, 0, 0.3)'}}
//           		/> :
//           	<div style={{width: "80%"}}>
// 	          	<TextField 
// 	          		fullWidth={true}
// 	          		style={{paddingLeft: "10%"}}
// 	          		id="Timeline-Variable-Table-Editor"
// 	          		value={(value.value === null) ? "" : value.value}
// 	          		onChange={(e, v) => {
// 	          			this.setValue(v);
// 	          		}}
// 	          	/>
//           	</div>
//           }
//           {(value.mode === ParameterMode.USE_FUNC) ?
//           	null :
//           	Toggle
//           }
//           </div>
//       </div>
//     )
//   }
// }