// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract Wall {
    uint256 totalPosts;

    event NewPost(address indexed from, uint256 timestamp, string message);

    struct Post {
        address user;
        uint256 timestamp;
        string message;
    }

    Post[] posts;

    constructor() payable {
        console.log("Yo yo, I am a contract and I am smart");
    }

    function post(string memory _message) public {
        totalPosts += 1;

        console.log("%s has posted!", msg.sender);

        posts.push(Post(msg.sender, block.timestamp, _message));

        emit NewPost(msg.sender, block.timestamp, _message);

        uint256 prizeAmount = 0.0001 ether;

        require(
            prizeAmount <= address(this).balance,
            "Trying to withdraw more money than the contract has."
        );

        (bool success, ) = (msg.sender).call{value: prizeAmount}("");

        require(success, "Failed to withdraw money from contract.");
    }

    function getAllPosts() public view returns (Post[] memory) {
        return posts;
    }

    function getTotalPosts() public view returns (uint256) {
        console.log("We have %d total posts!", totalPosts);

        return totalPosts;
    }
}
