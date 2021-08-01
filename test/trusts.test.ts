// We import Chai to use its assertion functions here.
import {expect} from "./chai-setup";

// we import our utilities
import {setupUsers, setupUser} from './utils';

// We import the hardhat environment field we are planning to use
import {ethers, deployments, getNamedAccounts, getUnnamedAccounts} from 'hardhat';

// we create a setup function that can be called by every test and setup variable for easy to read tests
async function setup () {
    // it first ensures the deployment is executed and reset (use of evm_snapshot for faster tests)
    await deployments.fixture(["Trusts"]);

    const Trusts = await ethers.getContract('Trusts');

    return Trusts;
}

// `describe` is a Mocha function that allows you to organize your tests. It's
// not actually needed, but having your tests organized makes debugging them
// easier. All Mocha functions are available in the global scope.

// `describe` receives the name of a section of your test suite, and a callback.
// The callback must define the tests of that section. This callback can't be
// an async function.
describe("Trusts contract", function() {

  // You can nest describe calls to create subsections.
    describe("Deploy trust contract", function () {
        // `it` is another Mocha function. This is the one you use to define your
        // tests. It receives the test name, and a callback function.

        // If the callback function is async, Mocha will `await` it.
        it("Deployment", async function () {
            // Expect receives a value, and wraps it in an Assertion object. These
            // objects have a lot of utility methods to assert values.

            // before the test, we call the fixture function.
            // while mocha have hooks to perform these automatically, they force you to declare the variable in greater scope which can introduce subttle errors
            // as such we prefers to have the setup called right at the beginning of the test. this also allow yout o name it accordingly for easier to read tests.
            const Trusts = await setup();

            // This test expects the owner variable stored in the contract to be equal to our configured owner

            //expect(await Trusts.owner()).to.equal(trustsCreator);
        });

    });
    describe("Create & Delete a trust", function () {
        
        it("Should create & delete trust", async function () {
            const {trustCreator, trustBeneficiary } = await getNamedAccounts();
            const Trusts = await setup();

            // Validate we have NO TRUSTS to start
            expect(await Trusts.getTrustCount()).to.equal(0);
            
            // Create a new Trust
            const overflow = {
                value: 1,
            };

            await Trusts.createTrust(trustBeneficiary, trustBeneficiary, "Test Trust", 0, overflow);

            let count = await Trusts.getTrustCount();

            expect(await Trusts.getTrustCount()).to.equal(1);

            const trustKey = await Trusts.getTrustAtIndex(0);

            const { key, 
                    name, 
                    beneficiary, 
                    trustee, 
                    etherAmount,
                    creator,
                    createdDate,
                    maturityDate } = await Trusts.getTrust(trustKey);
                    
            expect (name).to.equal("Test Trust");
            expect (beneficiary).to.equal(trustBeneficiary);
            expect (trustee).to.equal(trustBeneficiary);
            expect (etherAmount).to.equal(1);
            expect (creator).to.equal(trustCreator);

            await Trusts.withdrawAll(key);

            await Trusts.deleteTrust(key);

            count = await Trusts.getTrustCount()
            expect(count).to.equal(0);

        });
    });
});

