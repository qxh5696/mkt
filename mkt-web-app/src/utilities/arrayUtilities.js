
export function arraySubtraction(originalArray, subtractionArray) {
    let set = new Set();
    subtractionArray.map((el) => {
        set.add(el._id['$oid']);
        return null;
    });
    return originalArray.filter((el) => !set.has(el._id['$oid']));
}