pragma solidity >=0.6.0 <0.9.0;

// SPDX-License-Identifier: Unlicensed

import { Bytes32Set } from "./Bytes32Set.sol";
import "hardhat/console.sol";

contract Trusts {
 
    using Bytes32Set for Bytes32Set.Set;
    Bytes32Set.Set trustSet;

    /*
    REVOCABLE: grantor can change or modify trust at will
    IRREVOCABLE: grantor cannot change or modify trust
    CHARITABLE: IRREVOCABLE - Benefits GRANTOR, beneficiary AND a qualified CHARITY
    CHARITABLE LEAD: (CLAT) Provides support to a charity through an annuity for a period of time. Remaining assets eventually go to beneficiary
    CHARITABLE REMAINDER: (CRAT) Opposite of CLAT: Benefits accrue to grantor and beneficiary for a period of time, with remainder going to charity
    QTIP: Qualified Terminable Interest Property Trust: Provide income for surviving spouse. Grantor controls assets after the death of the spouse.
    GRAT: Grantor Retained Annuity Trust: IRREVOCABLE - setup for certain period of time to minimize taxes on large financial gifts to beneficiary. 
        Trustor pays taxes on the assets when the trust is establiehd and received an annual annuity payment for the term of the GRAT.
        When the term ends, the beneficiary reveive the remaining assets.
    ILIT: IRREVOCABLE LIFE INSURANCE TRUST -  LIFE INSURNACE ONLY - NOT APPLICABLE
    FUNDERAL: IRREVOCABLE - Set aside money to cover burial and funeral costs. Funeral homes often serve as the trustee
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
    TODO: Support "Grantor death event" - which switches the trust to irrevocable and activates the trustee
            (Also support DUAL trustors (Spouses) such that one death transfers to the living trustor)
    TODO: Rules: beneficiary to receive income from trust until a certain age, at which point the property will distrubute to them
    TODO: ADD Support for Successor trustee. 1) Grantor = Trustee until death.  ONLY For REVOCABLE TRUST
    */
    
    enum TrustType { 
        REVOCABLE,
        IRREVOCABLE,
        QTIP,          
        GRAT,       
        SPECIAL_NEEDS,
        SPENDTHRIFT
    }

    TrustType constant DEFAULT_TYPE = TrustType.REVOCABLE;
    
    // data structure that stores a trust
    struct Trust {
        bytes32 key;
        string name;
        address grantor;
        address[] trustees;
        address beneficiary;
        uint etherAmount;
        uint createdDate;
        uint maturityDate;
        TrustType trustType;
    }
    
    mapping(bytes32 => Trust) trusts;
    
    event LogCreateTrust(address sender, bytes32 key);
    event LogUpdateTrust(address sender, bytes32 key);    
    event LogDepositTrust(address sender, bytes32 key, uint etherAmount);    
    event LogRemoveTrust(address sender, bytes32 key);
    event LogWithdrawTrust(address sender, bytes32 key, uint etherAmount);

    /**
     * Constructor function
     */
    constructor() {
    }

    /**
     * Create a new trust
     * @param beneficiary Who is this for
     * @param trustees Trustee to manage trust
     * @param name Name of trust
     * @param maturityDate When this trust matures (is accessible)
     * @param trustType Type of trust
     */
    function createTrust (address beneficiary, 
                          address[] memory trustees,
                          string memory name,
                          uint maturityDate,
                          TrustType trustType) 
                          
                          public payable returns(bytes32 key) {
        

        validateAddresses(beneficiary, trustees, msg.sender);

        bytes32 newKey =  hashKey(name, maturityDate, msg.sender, beneficiary, block.timestamp);
        
        trustSet.insert(newKey); // Note that this will fail automatically if the key already exists.
        
        Trust storage t = trusts[newKey];
        
        t.key = newKey;
        t.name = name;
        t.beneficiary = beneficiary;
        t.trustees = trustees;
        t.etherAmount = msg.value;
        t.grantor = msg.sender;
        t.createdDate = block.timestamp;
        t.maturityDate = maturityDate;
        t.trustType = trustType;
        
        console.log("Trust.sol::createTrust() - createTrust Event Emitting NOW....: KEY: ");
        console.logBytes32(t.key);

        emit LogCreateTrust(msg.sender, t.key);
        
        return (t.key);
    }

    /**
     * Update some of the settings of the trust (not all)
     * @param key Trust to update
     * @param beneficiary New Beneficiary
     * @param trustees New Trustees (array)
     * @param name New name
     * @param maturityDate New Date
     */
    function updateTrust(bytes32 key, 
                         address beneficiary, 
                         address[] memory trustees,
                         string memory name,  
                         uint maturityDate) public {
        
        require(trustSet.exists(key), "Can't update a trust that doesn't exist.");
        Trust storage t = trusts[key];

        require(msg.sender == t.grantor, "Only the grantor can update this trust.");

        t.name = name;
        
        validateAddresses(beneficiary, trustees, msg.sender);

        // Apply changes for REVOCABLE trust type only
        // IF trying to change one of these fields on NON-revocable trust type, throw an error
        if(t.trustType != TrustType.REVOCABLE && (t.beneficiary != beneficiary || t.maturityDate != maturityDate)) {
        
            revert("Beneficiary, Trustees and Maturity date can only be updated in a REVOCABLE trust");
        
        } else if(t.trustType == TrustType.REVOCABLE) {

            t.beneficiary = beneficiary;
            t.trustees = trustees;
            t.maturityDate = maturityDate;
            emit LogUpdateTrust(msg.sender, t.key);
        
        } 

    }
    
    /**
     * Validate address fields for a trust
     * @param beneficiary Beneficiary string
     * @param trustees Trustees
     * @param sender msg.Sender
     */
    function validateAddresses(address beneficiary, 
                                address[] memory trustees,
                                address sender) public pure {

        require(!exists(beneficiary, trustees), "Beneficiary cannot be a trustee");

        require(!exists(sender, trustees), "Grantor cannot be a trustee");

        require(beneficiary != sender, "Beneficiary cannot be grantor");
        
        for (uint i=0;i<trustees.length;i++)
            require(trustees[i] == address(trustees[i]), "Invalid Trustee address");
                                
    }

    /**
     * Deposit some ETH to this account
     * @param key Trust to deposit to
     */
    function depositTrust(bytes32 key) public payable {
        
        require(trustSet.exists(key), "Can't update a trust that doesn't exist.");
        
        Trust storage t = trusts[key];

        t.etherAmount += msg.value;

        emit LogDepositTrust(msg.sender, key, msg.value);
    }

    /**
     * Delete a trust - must have 0 balance
     * @param key Trust to delete
     */    
    function deleteTrust(bytes32 key) public {

        require(trustSet.exists(key), "Can't delete a trust that doesn't exist.");
        
        Trust memory t = trusts[key];

        require(t.etherAmount == 0, "Can't delete a trust with ether, withdraw first.");
        require(msg.sender == t.grantor, "Only the grantor can delete this trust.");

        trustSet.remove(key); // Note that this will fail automatically if the key doesn't exist
        
        delete trusts[key];
        
        emit LogRemoveTrust(msg.sender, key);
    }

    /**
     * Get a trust details
     * @param _key Trust to return
     */
    function getTrust(bytes32 _key) public view returns( bytes32 key,
                                                        string memory name, 
                                                        address grantor,
                                                        address[] memory trustees,
                                                        address beneficiary,
                                                        uint etherAmount,
                                                        uint createdDate,
                                                        uint maturityDate,
                                                        TrustType trustType) {
        
        require(trustSet.exists(_key), "Can't get a trust that doesn't exist.");
        
        Trust storage t = trusts[_key];

        return(t.key, t.name, t.grantor, t.trustees, t.beneficiary, t.etherAmount, t.createdDate, t.maturityDate, t.trustType);
    }
    
    /**
     * Get the number of trusts
     * @param count of trusts
     */
    function getTrustCount() public view returns(uint count) {
        return trustSet.count();
    }
    
    /**
     * Read the trust details at a given index (used to iterate)
     * @param index trust index
     */
    function getTrustAtIndex(uint index) public view returns(bytes32 key) {
       
        if(trustSet.count() == 0) {
            console.log("getTrustAtIndex() - trustSet.count is 0");
            return 0;
        }
        else
            return trustSet.keyAtIndex(index);
    }

    /**
     * Returns whether a withdrawal can be made 
     * @param key Trust to check
     * @param sender Who is withdrawing
     */
    function canWithdraw(bytes32 key, address sender) public view returns(bool result, string memory reason) {
        result = false;
        require(trustSet.exists(key), "Trust doesn't exist.");

        Trust storage t = trusts[key];

        if(t.trustType == TrustType.REVOCABLE) {
            if(sender == t.grantor || 
               sender == t.beneficiary || 
               exists(sender, t.trustees))
                result = true;
            else 
                reason = "REVOCABLE type trust may be withdrawn only by grantor, beneficiary or trustee";

        } else if (t.trustType == TrustType.IRREVOCABLE ||
                    t.trustType == TrustType.QTIP ||
                    t.trustType == TrustType.GRAT ||
                    t.trustType == TrustType.SPECIAL_NEEDS ||
                    t.trustType == TrustType.SPENDTHRIFT) {
            if(sender == t.beneficiary || exists(sender, t.trustees))
                result = true;
            else 
                reason = "IRREVOCABLE type trust may be withdrawn only by beneficiary or trustee";

        } else { 
            if(sender == t.grantor || exists(sender, t.trustees))
                result = true;
            else
                reason = "DEFAULT trust type: may be withdrawn only by grantor or trustee";
        }
        return (result, reason);
    }
    
    /**
     * Withdraw ETH
     * @param key Trust to withdraw from
     * @param etherAmount Amount to withdraw
     */
    function withdraw (bytes32 key, uint etherAmount) public payable {
        require(trustSet.exists(key), "Trust doesn't exist.");

        Trust storage t = trusts[key];

        bool result = false;
        string memory reason = "";

        (result, reason) = canWithdraw(key, msg.sender);

        if(!result) revert(reason);

        // beneficiary can only withdraw AFTER the maturityDate
        // TODO: Support "DEATH" of grantor in addition to maturityDate 
        if(msg.sender == t.beneficiary && 
            t.maturityDate > block.timestamp) {
            revert("beneficiary can only withdraw AFTER maturity date");
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
    
    /**
        PRIVATE helpers    
     */
    
    /**
    * Check if a trustee exists
    * @param item to check for
    * @param list of items to iterate
    */
    function exists(address item, address[] memory list) private pure returns(bool result) {
        for(uint i = 0; i < list.length; i++)
            if(item == list[i])
                return true;

        return false;
    }
    
    /**
     * return a hash for the key for a trust
     * @param _name of trust
     * @param _num Trust number?
     * @param _sender Sender address
     * @param _beneficiary Beneficiary address
     * @param _timestamp the current time
    */
    function hashKey(string memory _name,
                  uint _num,
                  address _sender,
                  address _beneficiary,
                  uint _timestamp) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(_name, _num, _sender, _beneficiary, _timestamp));
    }

}
