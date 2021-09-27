/*

    CurrencyExchange.ts

    Component used to translate currencies, uses cryptocompare

*/
import { inject, provide } from 'vue';
import { ethers } from 'ethers';
import { BigNumberish } from '@ethersproject/bignumber';

interface Exchange {
    USD: number,
    BTC: number,
    EUR: number,
}

export const ceSymbol = Symbol('CurrencyExchange');
export const useCurrencyExchange = (): CurrencyExchange => <CurrencyExchange> inject(ceSymbol);
export const createCurrencyExchange = (): CurrencyExchange => new CurrencyExchange();
export const provideCurrencyExchange = (): CurrencyExchange => {
    const ce = createCurrencyExchange();
    provide(ceSymbol, ce);
    return ce;
};

export default class CurrencyExchange {

    public exchange: Exchange | undefined;
    public formatter: Intl.NumberFormat;

    constructor() {
    
        this.formatter = new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 2});
    }

    async init() {
        // LOAD ETH-USD 
        const response = await fetch("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD,BTC,EUR");
        this.exchange = await response.json();
        
        //console.log(this.exchange);
    }

    // HELPERS

    eth2usd = (eth: number): number => {

        if(!this.exchange) 
        {
            console.error("Exchange Not Ready", this.exchange);
            return -1;
        }
        return this.exchange.USD * eth;
    }
    
    wei2usd = (wei: BigNumberish): string => {
        let eth = ethers.utils.formatEther(wei);
        return this.eth2usdFormatted(Number(eth));
    }

    eth2usdFormatted = (eth: number): string => {
        if(!this.formatter || !this.exchange)
        {
            console.error("Exchange Not Ready", this.formatter, this.exchange);
            return "NaN";
        }

        return this.formatter.format(this.eth2usd(eth));
    }
}


