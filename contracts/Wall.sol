// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract Wall {
    uint256 totalPosts;

    constructor() {
        console.log("Yo yo, I am a contract and I am smart");
    }

    function post() public {
        totalPosts += 1;

        console.log("%s has posted!", msg.sender);
    }

    function getTotalPosts() public view returns (uint256) {
        console.log("We have %d total posts!", totalPosts);

        return totalPosts;
    }
}
