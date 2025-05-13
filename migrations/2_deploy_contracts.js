const Voting = artifacts.require("Voting");

module.exports = async function (deployer) {
  // Lis t of candidate names
  const candidateNames = ["candidate1", "candidate2"];
  
  // Deploy Voting contract and pass the candidate names
  await deployer.deploy(Voting, ...candidateNames);
};

