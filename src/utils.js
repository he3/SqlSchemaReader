
function distinct(arr, fn) {
    return arr.reduce((prev, cur) => {
        const val = fn(cur);
        if (!prev.includes(val))
            prev.push(val);
        return prev;
    }, []);
}


module.exports ={
    distinct
};