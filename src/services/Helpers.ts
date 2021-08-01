import { ethers } from 'ethers';
import { BigNumberish } from '@ethersproject/bignumber';

/*

    Helpers

*/
export const shortenAddress = (str: string) => { return str.substr(0, 6) + '\u2026' + str.substr(str.length-4, 4); };
export const toDate = (timestamp: number) => { return new Date(timestamp * 1000).toLocaleDateString('en-US', { timeZone: 'UTC' }) };
export const toEther = (wei: BigNumberish) => { return ethers.utils.formatEther(wei); };
//export const toWei = (ether: BigNumberish) => { return ethers.utils.formatUnits(ether, 'wei'); };
export const round = (num: number, precision: number=2) => { return Math.round(Number((Math.abs(num) * precision**10).toPrecision(16))) / precision**10 * Math.sign(num); };

