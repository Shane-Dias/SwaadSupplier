const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("Starting deployment...");
  
  // Get the ContractFactory and Signers
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());
  
  // Deploy the contract
  const VendorTrust = await hre.ethers.getContractFactory("VendorTrust");
  const vendorTrust = await VendorTrust.deploy();
  
  await vendorTrust.waitForDeployment();
  
  const contractAddress = await vendorTrust.getAddress();
  console.log("VendorTrust deployed to:", contractAddress);
  
  // Get network name
  const network = hre.network.name;
  console.log("Deployed on network:", network);
  
  // Save contract address and ABI to file
  const contractInfo = {
    address: contractAddress,
    network: network,
    deployer: deployer.address,
    deploymentTime: new Date().toISOString(),
    abi: JSON.parse(vendorTrust.interface.formatJson())
  };
  
  // Create src/contracts directory if it doesn't exist
  const contractsDir = path.join(__dirname, '..', 'src', 'contracts');
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }
  
  // Save contract info
  const contractInfoPath = path.join(contractsDir, `contract-${network}.json`);
  fs.writeFileSync(contractInfoPath, JSON.stringify(contractInfo, null, 2));
  
  console.log(`Contract info saved to: ${contractInfoPath}`);
  
  // Verify contract on etherscan (if not local network)
  if (network !== "hardhat" && network !== "localhost") {
    console.log("Waiting for block confirmations...");
    await vendorTrust.deploymentTransaction().wait(6);
    
    console.log("Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("Contract verified on Etherscan");
    } catch (error) {
      console.log("Error verifying contract:", error.message);
    }
  }
  
  // Add some initial data for testing
  if (network === "localhost" || network === "hardhat") {
    console.log("Adding test data...");
    
    // Register test suppliers
    await vendorTrust.registerSupplier(
      "Fresh Vegetables Co.",
      "Premium quality vegetables supplier",
      "contact@freshveg.com"
    );
    
    await vendorTrust.registerSupplier(
      "Spice Masters",
      "Traditional spices and masalas",
      "info@spicemasters.com"
    );
    
    console.log("Test data added successfully");
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });