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

    IERC20 private _vladoCoin = IERC20(0x171568D895120Cd57Bd64270f2501C88b5067B5b);

    Post[] public posts;

    uint256 public totalPosts;
    uint256 private _seed;
    uint256 private _prizeAmount = 1000 ether;

    mapping(address => uint256) public lastPostedAt;

    event NewPost(address indexed fromUser, uint256 timestamp, string message);

    constructor() payable {
        _seed = (_generateSeed() + block.timestamp + block.difficulty) % 100;
    }

    function _checkLastPostTime() private {
        require(
            lastPostedAt[msg.sender] + 12 hours < block.timestamp,
            "You need to wait 12 hours from your last post before posting again"
        );

        lastPostedAt[msg.sender] = block.timestamp;
    }

    function _addNewPost(string memory message) private {
        posts.push(Post(msg.sender, block.timestamp, message));

        totalPosts += 1;
    }

    function _generateSeed() private view returns (uint256) {
        uint256 min = 1;
        uint256 max = 100;
        uint256 seed = (uint256(
            keccak256(
                abi.encodePacked(
                    blockhash(block.number - min),
                    gasleft(),
                    (block.timestamp + block.difficulty + _seed)
                )
            )
        ) % max) + min;

        return seed;
    }

    function _transferVLA(uint256 prizeAmount) private {
        require(
            prizeAmount <= _vladoCoin.balanceOf(address(this)),
            "There are not enough tokens on the contract balance"
        );

        _vladoCoin.transfer(msg.sender, prizeAmount);
    }

    function _sendPrize() private {
        _seed = _generateSeed();

        if (_seed <= 25 && _seed > 15) {
            _transferVLA(_prizeAmount);
        } else if (_seed <= 15 && _seed > 5) {
            _transferVLA(_prizeAmount * 5);
        } else if (_seed <= 5) {
            _transferVLA(_prizeAmount * 10);
        }
    }

    function getAllPosts() public view returns (Post[] memory) {
        return posts;
    }

    function getTotalPosts() public view returns (uint256) {
        return totalPosts;
    }

    function createPost(string memory message) public {
        _checkLastPostTime();
        _addNewPost(message);
        _sendPrize();

        emit NewPost(msg.sender, block.timestamp, message);
    }
}
