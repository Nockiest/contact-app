export const deleteObjectFromArray = (objId: string|number, array: any[]): any[] => {
    const filteredArray = array.filter(obj => obj.id === objId);

    if (filteredArray.length === 0) {
        throw new Error(`Object with id ${objId} does not exist in the array.`);
    } else if (filteredArray.length > 1) {
        console.warn(`Warning: More than one object with id ${objId} found in the array.`);
    }

    return array.filter(obj => obj.id !== objId);
}