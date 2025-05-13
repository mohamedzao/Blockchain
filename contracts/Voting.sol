// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Voting {
    mapping(bytes32 => uint256) public votesReceived; // Store votes for each candidate hash
    mapping(address => bool) public hasVoted  ;
    mapping(bytes32 => bool) public validCandidates; // Track valid candidate hashes
    bytes32[] public candidateHashes; // Store all candidate hashes

    address public owner;

    event Voted(address indexed voter, bytes32 candidateHash);

    // Constructor accepts two individual candidate names
    constructor(string memory candidate1, string memory candidate2) {
        owner = msg.sender;
        
        // Add candidates during deployment and hash their names
        bytes32 candidateHash1 = keccak256(abi.encodePacked(candidate1));
        bytes32 candidateHash2 = keccak256(abi.encodePacked(candidate2));

        validCandidates[candidateHash1] = true;
        validCandidates[candidateHash2] = true;

        candidateHashes.push(candidateHash1);
        candidateHashes.push(candidateHash2);
    }

    // Vote for a candidate using their name as a string, which is then hashed to bytes32
    function voteForCandidate(string memory candidateName) public {
        bytes32 candidateHash = keccak256(abi.encodePacked(candidateName));

        require(validCandidates[candidateHash], "Invalid candidate selected");
        require(!hasVoted[msg.sender], "Already voted");

        votesReceived[candidateHash]++;
        hasVoted[msg.sender] = true;

        emit Voted(msg.sender, candidateHash);
    }

    // Get votes for a candidate using their name as a string
    function getVotesForCandidate(string memory candidateName) public view returns (uint256) {
        bytes32 candidateHash = keccak256(abi.encodePacked(candidateName));

        require(validCandidates[candidateHash], "Invalid candidate");

        return votesReceived[candidateHash];
    }

    // Get all candidate hashes
    function getCandidateHashes() public view returns (bytes32[] memory) {
        return candidateHashes;
    }

    // Check if the candidate is valid using their name as a string
    function isValidCandidate(string memory candidateName) public view returns (bool) {
        bytes32 candidateHash = keccak256(abi.encodePacked(candidateName));
        return validCandidates[candidateHash];
    }
   
    

}

