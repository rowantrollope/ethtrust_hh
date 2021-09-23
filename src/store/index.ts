import { reactive, watch, inject } from 'vue';

export const storeSymbol = Symbol('Store');
export const useStore = (): Store => <Store> inject(storeSymbol);
export const createStore = (): Store => new Store();

export class Store {
    
    public state = reactive({
        autoConnect: true,
        developerMode: false,
        lastWallet: "",
        lastNetwork: 1,
    });

    constructor() {
        this.load();
        watch(this.state, () => this.save());
    }

    public save = () => localStorage.setItem("state0.0.2", JSON.stringify(this.state));

    public load = () => {
        const saved = localStorage.getItem("state0.0.2");
        if(saved) 
            this.state = reactive(JSON.parse(saved));
        console.log("Store::load()", this.state);
    }

}