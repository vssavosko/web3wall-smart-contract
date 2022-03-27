// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Web3Wall {
    struct Post {
        address fromUser;
        uint256 timestamp;
        string message;
    }

    uint256 public totalPosts;
    uint256 private seed;

    Post[] posts;

    mapping(address => uint256) public lastPostedAt;

    event NewPost(address indexed fromUser, uint256 timestamp, string message);

    constructor() payable {
        seed = getSeed();
    }

    function getSeed() private view returns (uint256) {
        return (block.timestamp + block.difficulty) % 100;
    }

    function sendPrize() private {
        seed = getSeed();

        if (seed <= 50) {
            uint256 prizeAmount = 0.0001 ether;

            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has"
            );

            (bool success, ) = (msg.sender).call{value: prizeAmount}("");

            require(success, "Failed to withdraw money from contract");
        }
    }

    function getAllPosts() public view returns (Post[] memory) {
        return posts;
    }

    function getTotalPosts() public view returns (uint256) {
        return totalPosts;
    }

    function createPost(string memory _message) public {
        require(
            lastPostedAt[msg.sender] + 12 hours < block.timestamp,
            "You need to wait 12 hours from your last post before posting again"
        );

        lastPostedAt[msg.sender] = block.timestamp;

        totalPosts += 1;

        posts.push(Post(msg.sender, block.timestamp, _message));

        sendPrize();

        emit NewPost(msg.sender, block.timestamp, _message);
    }
}
