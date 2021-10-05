import { reactive, provide, watch, inject } from 'vue';

export const storeSymbol = Symbol('Store');
export const useStore = (): Store => <Store> inject(storeSymbol);
export const provideStore = (): Store => {
    const store = new Store();
    provide(storeSymbol, store);
    return store;
}

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

    public save = () => localStorage.setItem("state0.0.3", JSON.stringify(this.state));

    public load = () => {
        const saved = localStorage.getItem("state0.0.3");
        if(saved) 
            this.state = reactive(JSON.parse(saved));
    }

}