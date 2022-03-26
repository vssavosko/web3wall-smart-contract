// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract Wall {
    uint256 totalPosts;
    uint256 private seed;

    event NewPost(address indexed from, uint256 timestamp, string message);

    struct Post {
        address user;
        uint256 timestamp;
        string message;
    }

    Post[] posts;

    mapping(address => uint256) public lastPostedAt;

    constructor() payable {
        console.log("Yo yo, I am a contract and I am smart");

        seed = (block.timestamp + block.difficulty) % 100;
    }

    function post(string memory _message) public {
        require(
            lastPostedAt[msg.sender] + 30 seconds < block.timestamp,
            "You need to wait 30 seconds before posting again"
        );

        lastPostedAt[msg.sender] = block.timestamp;

        totalPosts += 1;

        console.log("%s has posted!", msg.sender);

        posts.push(Post(msg.sender, block.timestamp, _message));

        seed = (block.difficulty + block.timestamp + seed) % 100;

        console.log("Random # generated: %d", seed);

        if (seed <= 50) {
            console.log("%s won!", msg.sender);

            uint256 prizeAmount = 0.0001 ether;

            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );

            (bool success, ) = (msg.sender).call{value: prizeAmount}("");

            require(success, "Failed to withdraw money from contract.");
        }

        emit NewPost(msg.sender, block.timestamp, _message);
    }

    function getAllPosts() public view returns (Post[] memory) {
        return posts;
    }

    function getTotalPosts() public view returns (uint256) {
        console.log("We have %d total posts!", totalPosts);

        return totalPosts;
    }
}
