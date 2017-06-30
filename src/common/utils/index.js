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

export const convertEmptyStringToNull = (s) => ((s === '') ? null : s);

export const convertNullToEmptyString = (s) => ((!s) ? '' : s);

const _seeds = [43, 71, 131, 163, 11, 281, 47, 173, 89, 149, 223, 271, 269, 139, 227, 17, 83, 3, 211, 251, 277, 37, 
197, 61, 19, 13, 167, 97, 73, 233, 239, 257, 191, 29, 7, 137, 151, 2, 241, 107, 113, 53, 101, 5, 157, 23, 109, 31, 
179, 79, 181, 67, 103, 193, 229, 59, 127, 263, 199, 41]; // suffled first 60 primes

const _base = ['f', '8', 'T', 'z', 'm', 'R', 'w', 'o', 'p', 'A', 'Q', 'V', 'd', 'E', 'q', 'L', 'N', '3', 
'6', '5', 'M', 'K', 'u', 'c', 'O', 'B', 'J', 'n', '9', 'I', 'x', 'h', 'e', 'j', 'Z', 'g', 's', '2', '4', 'y', 
'k', 'a', 'S', 'C', '7', 'P', 'b', 'F','v', 'H', 'i', 'X', 'G', '0', 'D', 'U', 'r', 'l', 'W', 'Y', '1', 't'
] // shuffled 62 
  // 0 (base 10) = f
  // 1           = 8
  // 61          = t


export function getUUID(seeds=_seeds, base=_base) {
	let x = parseInt(Date.now()) * seeds[(new Date()).getMilliseconds()%60];
	return _10_to_62R(x, base);
}


const log62 = (x) => Math.log(x) / Math.log(62);


/*
Returns a REVERSED string representing a number of base 62

*/
export function _10_to_62R(x, base=_base) {
	if (x < 0) x = -x;
	if (x === 0) return base[x];

	let d = Math.floor(log62(x));
	let s = new Array(d+1);

	let p, q, r; 
	while (x) {
		p = Math.pow(62, d);
		q = Math.floor(x / p);
		x -= p * q;
		
		s[d--] = base[q];
	}

	return s.join("");
}