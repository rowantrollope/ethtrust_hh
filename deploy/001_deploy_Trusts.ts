import {HardhatRuntimeEnvironment} from 'hardhat/types'; // This adds the type from hardhat runtime environment.
import {DeployFunction} from 'hardhat-deploy/types'; // This adds the type that a deploy function is expected to fulfill.

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) { // the deploy function receives the hardhat runtime env as an argument
    const {deployments, getNamedAccounts} = hre; // we get the deployments and getNamedAccounts which are provided by hardhat-deploy.
    const {deploy} = deployments; // The deployments field itself contains the deploy function.

    const { deployer } = await getNamedAccounts(); // Fetch the accounts. These can be configured in hardhat.config.ts as explained above.

    console.log("deployer: ", deployer);
    await deploy('Trusts', { // This will create a deployment called 'Trusts'. By default it will look for an artifact with the same name. The 'contract' option allows you to use a different artifact.
        from: deployer, // Deployer will be performing the deployment transaction.
        log: true, //Ddisplay the address and gas used in the console (not when run in test though).
    });
}
export default func;
func.tags = ['Trusts']; // This sets up a tag so you can execute the script on its own (and its dependencies).

