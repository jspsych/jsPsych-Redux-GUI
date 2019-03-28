/* 
key: string,
position: int,
next: PathNode
*/
function PathNode(key, position=-1, next=null) {
    return {
        key: key,
        position: position,
        next: next
    };
}

/* 
parameterInfo: jsPsych parameter information object (defined in jspsych), 
path: PathNode (defined above)
*/
const locateNestedParameterInfo = (paramInfo, path) => {
    let parameterInfo = paramInfo;

    if (typeof path === 'object') {
        while (path) {
            if (path.next) {
                parameterInfo = parameterInfo.nested;
                parameterInfo = parameterInfo[path.next.key];
            }
            path = path.next;
        }
    }

    return parameterInfo
}

/*
parameterInfo: jsPsych parameter information object (defined in jspsych)
*/
const isParameterRequired = (parameterInfo) => {
    let isRequired = false;
    if (parameterInfo.hasOwnProperty('default')) {
        isRequired = parameterInfo.default === undefined;
    }
    return isRequired;
}

export {
    PathNode,
    locateNestedParameterInfo,
    isParameterRequired,
};

