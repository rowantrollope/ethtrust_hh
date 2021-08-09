pragma solidity >=0.6.0 <0.9.0;

// SPDX-License-Identifier: Unlicensed

import { Bytes32Set } from "./Bytes32Set.sol";
import "hardhat/console.sol";

contract Trusts {
 
    using Bytes32Set for Bytes32Set.Set;
    Bytes32Set.Set trustSet;

    /*
    REVOKABLE: grantor can change or modify trust at will
    IRREVOKABLE: grantor cannot change or modify trust
    CHARITABLE: IRREVOKABLE - Benefits GRANTOR, BENEFICIARIES AND a qualified CHARITY
    CHARITABLE LEAD: (CLAT) Provides support to a charity through an annuity for a period of time. Remaining assets eventually go to beneficiaries
    CHARITABLE REMAINDER: (CRAT) Opposite of CLAT: Benefits accrue to grantor and beneficiaries for a period of time, with remainder going to charity
    QTIP: Qualified Terminable Interest Property Trust: Provide income for surviving spouse. Grantor controls assets after the death of the spouse.
    GRAT: Grantor Retained Annuity Trust: IRREVOKABLE - setup for certain period of time to minimize taxes on large financial gifts to beneficiaries. 
        Trustor pays taxes on the assets when the trust is establiehd and received an annual annuity payment for the term of the GRAT.
        When the term ends, the beneficiaries reveive the remaining assets.
    ILIT: IRREVOKABLE LIFE INSURANCE TRUST -  LIFE INSURNACE ONLY - NOT APPLICABLE
    FUNDERAL: IRREVOKABLE - Set aside money to cover burial and funeral costs. Funeral homes often serve as the trustee
    SPENDTHRIFT: Protects inherited assets from the potential of financial irresponsibility of the beneficiary.
        The assets belong to the trust, the beneficiary and their creditors do not have direct access or control.
        The trustee has sole discretion to decide how the trust assets will be distributed.
        May choose certain $ amount per year, or may direct what the money can be spent on.
    SPECIAL_NEEDS: Allows Trustee to decide and direct how the assets of the trust can be used for a beneficiary.
    GENERATION_SKIPPING: Skips kids and goes to grandkids.
    TOTTEN: AKA Payable on Death.  Beneficiary directly receives assets of the trust upon death of grantor.
        Grantor can add and withdraw funds from the trust while they are living.  
        Grantor may also change beneficiary if needed or desired. 

    */

    /*
    TODO: Support multiple trustees
    TODO: Support reporting of trustee and grantor actions to beneficiaries (Withdrawals, Deposits, Returns )
    TODO: Support "Grantor death event" - which switches the trust to irrevokable and activates the trustee
            (Also support DUAL trustors (Spouses) such that one death transfers to the living trustor)
    TODO: How to determine death? 
    TODO: Rules: Beneficiaries to receive income from trust until a certain age, at which point the property will distrubute to them
    TODO: ADD Support for Successor trustee. 1) Grantor = Trustee until death.  ONLY For REVOKABLE TRUST

    */
    // need multiple beneficiaries
/*
    (1) revocable trust, 
    (2) irrevocable trust, 
    (3) QTIP, // needs spouse account - irrevokable
    (5) GRAT, // irrevokable
    (6) special needs
    provision to allow benficiary access at all
*/
    enum TrustType { 
        REVOKABLE, 
        IRREVOKABLE,
        QTIP, 
        GRAT, 
        SPECIAL_NEEDS,
        SPENDTHRIFT
    }

    TrustType constant DEFAULT_TYPE = TrustType.REVOKABLE;
    
    // data structure that stores a trust
    struct Trust {
        bytes32 key;
        string name;
        address grantor;
        address[] trustees;
        address[] beneficiaries;
        uint etherAmount;
        uint createdDate;
        uint maturityDate;
        TrustType trustType;
    }

    bytes32 nextKey;
 
    mapping(bytes32 => Trust) trusts;
    
    event LogCreateTrust(address sender, bytes32 key, string name);
    event LogUpdateTrust(address sender, bytes32 key, string name);    
    event LogDepositTrust(address sender, bytes32 key, uint etherAmount);    
    event LogRemoveTrust(address sender, bytes32 key);
    event LogWithdrawTrust(address sender, bytes32 key, uint etherAmount);

    /**
     * Constructor function
     */
    constructor() {
        nextKey = '0x1';
    }
    /**
     * Create a new trust
     * @param beneficiaries Who is this for
     * @param trustees Trustee to manage trust
     * @param name Name of trust
     * @param maturityDate When this trust matures (is accessible)
     * @param trustType Type of trust
     */
    function createTrust (address[] memory beneficiaries, 
                          address[] memory trustees,
                          string memory name,
                          uint maturityDate,
                          TrustType trustType) 
                          
                          public payable returns(bytes32 key) {
        
        require(beneficiaries[0] != trustees[0] &&
                beneficiaries[0] != msg.sender &&
                trustees[0] != msg.sender, 
                "Trustee, Beneficiary and Trustee must be different accounts");
        
        require(beneficiaries[0] == address(beneficiaries[0]), "Invalid Beneficiary address");
        require(trustees[0] == address(trustees[0]), "Invalid Trustee address");

        trustSet.insert(nextKey); // Note that this will fail automatically if the key already exists.
        
        Trust storage t = trusts[nextKey];
    
        t.key = nextKey;
        t.name = name;
        t.beneficiaries = beneficiaries;
        t.trustees = trustees;
        t.etherAmount = msg.value;
        t.grantor = msg.sender;
        t.createdDate = block.timestamp;
        t.maturityDate = maturityDate;
        t.trustType = trustType;

        uint n = uint(nextKey);
        n++;
        nextKey = bytes32(n);
        
        console.log("Trust.sol::createTrust() - createTrust Event Emitting NOW....");
        emit LogCreateTrust(msg.sender, t.key, t.name);
        
        return (t.key);
    }

    function updateTrust(bytes32 key, 
                         address[] memory beneficiaries, 
                         address[] memory trustees,
                         string memory name,  
                         uint maturityDate) public {
        
        require(trustSet.exists(key), "Can't update a trust that doesn't exist.");
        Trust storage t = trusts[key];

        require(msg.sender == t.grantor, "Only the grantor can update this trust.");

        t.name = name;
        t.beneficiaries = beneficiaries;
        t.trustees = trustees;
        t.maturityDate = maturityDate;

        emit LogUpdateTrust(msg.sender, t.key, t.name);
    }
    
    function depositTrust(bytes32 key) public payable {
        
        require(trustSet.exists(key), "Can't update a trust that doesn't exist.");
        
        Trust storage t = trusts[key];

        t.etherAmount += msg.value;

        emit LogDepositTrust(msg.sender, key, msg.value);
    }
    
    function deleteTrust(bytes32 key) public {

        require(trustSet.exists(key), "Can't delete a trust that doesn't exist.");
        
        Trust memory t = trusts[key];

        require(t.etherAmount == 0, "Can't delete a trust with ether, withdraw first.");
        require(msg.sender == t.grantor, "Only the grantor can delete this trust.");

        trustSet.remove(key); // Note that this will fail automatically if the key doesn't exist
        
        delete trusts[key];
        
        emit LogRemoveTrust(msg.sender, key);
    }

    function getTrustName(bytes32 key) public view returns(string memory name) {
        require(trustSet.exists(key), "Trust not found");
        Trust storage t = trusts[key];
        return t.name;
    }
    function getTrust(bytes32 _key) public view returns( bytes32 key,
                                                        string memory name, 
                                                        address grantor,
                                                        address[] memory trustees,
                                                        address[] memory beneficiaries,
                                                        uint etherAmount,
                                                        uint createdDate,
                                                        uint maturityDate,
                                                        TrustType trustType) {
        
        require(trustSet.exists(_key), "Can't get a trust that doesn't exist.");
        
        Trust storage t = trusts[_key];

        return(t.key, t.name, t.grantor, t.trustees, t.beneficiaries, t.etherAmount, t.createdDate, t.maturityDate, t.trustType);
    }
    
    function getTrustCount() public view returns(uint count) {
        return trustSet.count();
    }
    
    function getTrustAtIndex(uint index) public view returns(bytes32 key) {
       
        if(trustSet.count() == 0) {
            console.log("getTrustAtIndex() - trustSet.count is 0");
            return '0x0';
        }
        else
            return trustSet.keyAtIndex(index);
    }

    function canWithdraw(bytes32 key, address sender) public view returns(bool result, string memory reason) {
        require(trustSet.exists(key), "Trust doesn't exist.");

        Trust storage t = trusts[key];

        if(t.trustType == TrustType.REVOKABLE) {
            if(sender == t.grantor || 
               sender == t.beneficiaries[0] || 
               exists(sender, t.trustees))
                result = true;
            else 
                reason = "REVOKABLE type trust requires sender to be grantor, beneficiary or trustee";

        } else if (t.trustType == TrustType.IRREVOKABLE) {
            if(sender == t.beneficiaries[0] || 
                exists(sender, t.trustees))
                result = true;
            else 
                reason = "IRREVOKABLE type trust requires sender to be beneficiary or trustee";

        } else { 
            if(sender == t.grantor || exists(sender, t.trustees))
                result = true;
            else
                reason = "DEFAULT trust type: Requires sender to be grantor or trustee";
        }
        return (result, reason);
    }
    
    function withdraw (bytes32 key, uint etherAmount) public payable {
        require(trustSet.exists(key), "Trust doesn't exist.");

        Trust storage t = trusts[key];

        bool result = false;
        string memory reason = "";

        (result, reason) = canWithdraw(key, msg.sender);

        if(!result) revert(reason);

        // Beneficiaries can only withdraw AFTER the maturityDate
        // TODO: Support "DEATH" of grantor in addition to maturityDate 
        if(msg.sender == t.beneficiaries[0] && 
            t.maturityDate > block.timestamp) {
            revert("Beneficiaries can only withdraw AFTER maturity date");
        }
        // Check ETHER Amount
        if(etherAmount > t.etherAmount) {
            revert("Can't withdraw more ether than exists in trust");
        }

        payable(msg.sender).transfer(etherAmount);
        
        t.etherAmount -= etherAmount;

        emit LogWithdrawTrust(msg.sender, key, etherAmount);

        console.log("Trust.sol - withdraw(), key: ${key} etherAmount: ${_etherAmount}");

    }
    
    function withdrawAll (bytes32 key) public payable {
    
        require(trustSet.exists(key), "Trust doesn't exist.");
        Trust memory t = trusts[key];
        console.log("Trust.sol - withdrawAll(), key: ");
        withdraw(key, t.etherAmount);

    }

    /**
        PRIVATE helpers    
     */
    function exists(address item, address[] memory list) private pure returns(bool result) {
        for(uint i = 0; i < list.length; i++)
            if(item == list[i])
                return true;

        return false;
    }
    
}
