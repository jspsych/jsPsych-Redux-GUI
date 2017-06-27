/*
Simple deepCopy,
Target can be 
object
boolean
number
array
undefined

*/
export function deepCopy(target) {
	if (!target) return target;

	let clone = target;

	let type = typeof(target);
	switch(type) {
		case "boolean":
		case "number":
		case "string":
			return clone;
		case "object":
			if (Array.isArray(clone)) {
				clone = [];
				for (let item of target) {
					clone.push(deepCopy(item));
				}
			} else {
				clone = {};
				let keys = Object.keys(target);
				for (let key of keys) {
					clone[key] = deepCopy(target[key]);
				}
			}
			return clone;
		case 'function':
			return clone;
		default:
			throw new TypeError(type + " not supported.");
	}
}


