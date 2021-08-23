const DigiArt = artifacts.require("DigiArt");

module.exports = async function(deployer) {
  await deployer.deploy(DigiArt);
};
