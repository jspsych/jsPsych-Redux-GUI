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
				let member;
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
			return new Function(clone.toString());
		default:
			throw new TypeError(type + " not supported.");
	}
}


/*
For functions, turn it to
{
	isFunc: true,
	code: function
}

*/
export function stringify(obj) {
	let type = typeof obj;
	switch(type) {
		case 'object':
			let res = [];
			if (Array.isArray(obj)) {
				res.push("[");
				let i = obj.length;
				for (let item of obj) {
					res.push(stringify(item));
					if (obj-- > 1) {
						res.push(",");
					}
				}
				res.push("]");
			} else if (obj.isFunc) { 
				let code = obj.code.replace(/\n/g, '').replace(/\t/g, '    ');
				// console.log(babel.transform(code).code);
				return code;
			}else {
				res.push("{");
				let keys = Object.keys(obj);
				for (let key of keys) {
					res.push('"' + key + '"' + ":" + stringify(obj[key]) + ",");  
				}
				res.push("}");
			}
			return res.join("");
		default:
			return JSON.stringify(obj);
	}
}