import React from 'react';

export function bindKeyboard(event) {
	console.log("in bind keyboard");
	// Mousetrap.bind('up', function(event){onUpPress(event);}, 'keyup');
 //    Mousetrap.bind('down', function(event){onDownPress(event);}, 'keyup');
 //    Mousetrap.bind('left', function(event){onLeftPress(event);}, 'keyup');
 //    Mousetrap.bind('right', function(event){onRightPress(event);}, 'keyup');
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
		document.getElementById(column).focus();
	} else {
		document.getElementById(nextRowCell+" "+column).focus();
	}
}

export function onDownPress(event) {
	let cell = document.getElementById(event.target.id);
	let id = cell.id.split(' ');
	let arrayCells = document.getElementsByName("cells");
	let nextRowCell = id[0]*1+1;
	console.log(nextRowCell); 
	let column = cell.dataset.column;
	console.log("nextCell " + column);

	
	if(event.target.name == "tableHeader") {
		document.getElementById(1+" "+column).focus();
	} else if(nextRowCell == undefined) {
		document.getElementById(nextRowCell+" "+column).focus();
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

export function onRightPress(event) {
	let cell = document.getElementById(event.target.id);
	let nextColumn = cell.dataset.column*1+1;
	let row = cell.dataset.row;

	if(event.target.name == "tableHeader") {
		document.getElementById(nextColumn).focus();
	} else {
		document.getElementById(row+" "+nextColumn).focus();
	}
}
