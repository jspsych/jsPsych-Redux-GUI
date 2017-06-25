import * as tableActions from '../../../actions/tableAction';

const onAddColumn = (dispatch, ownProps) => {
	dispatch(tableActions.addColumn(ownProps.id));
}

const onAddRow = (dispatch, ownProps) => {
	dispatch(tableActions.addRow(ownProps.id));
}

export function bindKeyboard(event) {
	console.log("in bind keyboard");
 switch(event.key) {
 	case 'ArrowUp': onUpPress(event);
 	break;
 	case 'ArrowDown': onDownPress(event);
 	break; 
 	case 'ArrowLeft': onLeftPress(event);
 	break;
 	case 'ArrowRight': onRightPress(event);
 	break;
 	default: console.log("key pressed "+event.key);
 }
}

export function onUpPress(event) {
	let cell = document.getElementById(event.target.id);
	let isFirstRow = cell.dataset.row; 
	let nextRowCell = cell.dataset.row-1;
	let column = cell.dataset.column;
	
	if(event.target.name == "tableHeader") {
		//Do nothing
	} else if(isFirstRow == 1) {
		console.log("infirstRow");
		document.getElementById(column).focus();
	} else {
		console.log("in else");
		document.getElementById(nextRowCell+" "+column).focus();
	}
}

export function onDownPress(dispatch,event) {
	let cell = document.getElementById(event.target.id);
	let id = cell.id.split(' ');
	let nextRowCell = id[0]*1+1;
	let column = cell.dataset.column;

	
	if(event.target.name == "tableHeader") {
		document.getElementById(1+" "+column).focus();
	} else if(document.getElementById(nextRowCell) == undefined) {
		console.log(event.target.id);
		dispatch(tableActions.addRow(event.target.id));
	} else {
		console.log("in else");
		console.log(nextRowCell);
		console.log(column);
		document.getElementById(nextRowCell+" "+column).focus();
	}
}

export function onLeftPress(event) {
	let cell = document.getElementById(event.target.id);
	let nextColumn = cell.dataset.column-1;
	let row = cell.dataset.row;

	if(event.target.name == "tableHeader") {
		document.getElementById(nextColumn).focus();
	} else {
		document.getElementById(row+" "+nextColumn).focus();
	}

}

export function onRightPress(dispatch, event) {
	let cell = document.getElementById(event.target.id);
	let nextColumn = cell.dataset.column*1+1;
	let row = cell.dataset.row;

	if(event.target.name == "tableHeader") {
		document.getElementById(nextColumn).focus();
	} else if(document.getElementById(nextColumn) == undefined) {
		console.log("handleColumn");
		this.onAddColumn(event.target.id);
	} else {
		document.getElementById(row+" "+nextColumn).focus();
	}
}
