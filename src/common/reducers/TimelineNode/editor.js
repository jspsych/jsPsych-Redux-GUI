import { deepCopy } from '../../utils';
import * as utils from './utils';

export function setName(state, action) {
	let node = state[state.previewId];
	if (!node) return state;

	let new_state = Object.assign({}, state);
	node = deepCopy(node);
	new_state[node.id] = node;

	node.name = action.name;

	return new_state;
}


export function createTable(id,
	timelineId,
	headerId,
	rowId,
	cellValue={}) {

	return {
		id: id,
		timelineId: utils.getTimelineId(),
		headerId: utils.getHeaderId(),
		rowId: utils.getRowId(),
		cellValue: cellValue
	};
}