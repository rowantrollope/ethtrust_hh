import { ethers } from 'ethers';
import { BigNumberish, } from '@ethersproject/bignumber';
/*
    Helpers,
*/
export namespace utils {

    export const shortenAddress = (str: string) => { 
        if(str) 
            return str.substr(0, 6) + '\u2026' + str.substr(str.length-4, 4); 
        else return '';
    };
    export const toDate = (timestamp: number) => { return new Date(timestamp * 1000).toLocaleDateString() };
    export const toEther = (wei: BigNumberish) => { return ethers.utils.formatEther(wei); };
    export const toEtherStringRounded = (wei: BigNumberish, precision: number=2) => {
        let n = parseFloat(ethers.utils.formatEther(wei)).toFixed(precision);
        return ethers.utils.commify(n.toString());
    };
    export const round = (num: number, precision: number=2) => { return Math.round(Number((Math.abs(num) * precision**10).toPrecision(16))) / precision**10 * Math.sign(num); };
    export const formatEtherString = (wei: BigNumberish) => ethers.utils.commify(ethers.utils.formatEther(wei));
}

