/*

    CurrencyExchange.ts

    Component used to translate currencies, uses cryptocompare

*/
import { ref } from 'vue';

export default class currencyExchange {

    public exchange = {};
    public formatter: Intl.NumberFormat;

    //name = ref("CurrencyExchange");

    constructor() {

        //this.name.value = "CurrencyExchange";

        this.init();

        this.formatter = new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 2});
    }

    async init() {
        // LOAD ETH-USD 
        const response = await fetch("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD,BTC,EUR");
        this.exchange = await response.json();
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

    eth2usdFormatted = (eth: number): string => {
        if(!this.formatter || !this.exchange)
        {
            console.error("Exchange Not Ready", this.formatter, this.exchange);
            return "NaN";
        }

        return this.formatter.format(this.eth2usd(eth));
    }
}


