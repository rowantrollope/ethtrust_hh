import { ethers } from 'ethers';
import { BigNumberish } from '@ethersproject/bignumber';

/*
    Helper methods
*/
export const shortenAddress = (str: string): string => { 
    if(str) 
        return str.substr(0, 6) + '\u2026' + str.substr(str.length-4, 4); 
    else return '';
};
export const toDate = (timestamp: number): string => { return new Date(timestamp * 1000).toLocaleDateString() };
export const toEther = (wei: BigNumberish): string => { return ethers.utils.formatEther(wei); };
export const toEtherStringRounded = (wei: BigNumberish, precision=2): string => {
    const n = parseFloat(ethers.utils.formatEther(wei)).toFixed(precision);
    return ethers.utils.commify(n.toString());
};
export const round = (num: number, precision=2): number => { return Math.round(Number((Math.abs(num) * precision**10).toPrecision(16))) / precision**10 * Math.sign(num); };
export const formatEtherString = (wei: BigNumberish): string => ethers.utils.commify(ethers.utils.formatEther(wei));
