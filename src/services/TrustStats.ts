import { provide, inject, computed, ref } from 'vue';

import TrustList, { useTrustList } from './TrustList';
import { useBlockchainConnect } from './BlockchainConnect';

//const list = useTrustList();
//const bc = useBlockchainConnect();

import Trust from './Trust';

enum UserType {
    None = 0,
    Grantor,
    Beneficiary,
    Trustee,
}

export const tsSymbol = Symbol('TrustStats');
export const useTrustStats = (): TrustStats => <TrustStats> inject(tsSymbol);
export const createTrustStats = (): TrustStats => new TrustStats();
export const provideTrustStats = (): TrustStats => {
    const tl = createTrustStats();
    provide(tsSymbol, tl);
    return tl;
};

export default class TrustStats {
    public isGrantor = computed(() => this.userType.value === UserType.Grantor);
    public isTrustee = computed(() => this.userType.value === UserType.Trustee);
    public isBeneficiary = computed(() => this.userType.value === UserType.Beneficiary);
/*
    public grantorTrusts = computed(() => {
        if(!list || !list.trusts.value) return 0;
        
        return list.trusts.value.filter(trust => 
            trust.grantor.toUpperCase() === bc.account.value.toUpperCase() ).length;
    });

    public beneficiaryTrusts = computed(() => {
        if(!list || !list.trusts.value) return 0;
        
        return list.trusts.value.filter(trust => 
            trust.grantor.toUpperCase() === bc.account.value.toUpperCase() ).length;
    });

    public trusteeTrusts = computed(() => {
        if(!list || !list.trusts.value) return 0;
        
        return list.trusts.value.filter(trust => 
            -1 !== trust.trustees.findIndex(trustee => 
                trustee.toUpperCase() === bc.account.value.toUpperCase()
            )).length;
    });
*/
    public grantorTrusts = ref(0);
    public trusteeTrusts = ref(0);
    public beneficiaryTrusts = ref(0);

    private userType = computed((): UserType => {
        if(this.grantorTrusts.value > 0)
            return UserType.Grantor;
        else if (this.beneficiaryTrusts.value > 0)
            return UserType.Beneficiary;
        else if (this.trusteeTrusts.value > 0)
            return UserType.Trustee;
        else
            return UserType.None;
    });

    constructor() {

    }

    public load(list: TrustList, account: string) {
        if(!list || !list.trusts.value) return;

        this.trusteeTrusts.value = list.trusts.value.filter(trust => 
            -1 !== trust.trustees.findIndex(trustee => 
                trustee.toUpperCase() === account.toUpperCase()
            )).length;
 
        this.grantorTrusts.value = list.trusts.value.filter(trust => 
            trust.grantor.toUpperCase() === account.toUpperCase() ).length;

        this.beneficiaryTrusts.value = list.trusts.value.filter(trust => 
            trust.beneficiary.toUpperCase() === account.toUpperCase() ).length;

    }
}
