

export function generateRandomCode( digits: number ):string {

    let newCode: string = '';

    for ( let i = 0; i < digits; i++ ) {
        newCode += Math.floor( Math.random() * 10 ).toString();
    }

    return newCode;
}
