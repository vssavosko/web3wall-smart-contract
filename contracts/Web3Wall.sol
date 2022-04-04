// SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Web3Wall {
    struct Post {
        address fromUser;
        uint256 timestamp;
        string message;
    }

    IERC20 private vladoCoin = IERC20(0x171568D895120Cd57Bd64270f2501C88b5067B5b);

    Post[] public posts;

    uint256 public totalPosts;
    uint256 private seed;
    uint256 private prizeAmount = 100 ether;

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
            require(
                prizeAmount <= vladoCoin.balanceOf(address(this)),
                "Trying to withdraw more money than the contract has"
            );

            vladoCoin.transfer(msg.sender, prizeAmount);
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
