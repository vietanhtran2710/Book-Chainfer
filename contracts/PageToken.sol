// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./NFTOwnership.sol";

contract PageToken is ERC20 {
    NFTOwnership nftContract;

    event BuyToken(uint256 newTokenID);

    constructor(address _nftContractAddress) ERC20("Page", "PAGE") {
        _mint(msg.sender, 100000);
        nftContract = NFTOwnership(_nftContractAddress);
    }

    function buyToken(uint256 tokenId) public returns (uint256) {
        uint256 tokenPrice = nftContract.getTokenPrice(tokenId);
        require(tokenPrice != 0, "Book is not for sale");
        require(balanceOf(msg.sender) >= tokenPrice, "Sender doesn't have enough token to buy");
        address tokenOwner = nftContract.ownerOf(tokenId);
        transfer(tokenOwner, tokenPrice);
        uint256 newTokenId = nftContract.sellReadToken(msg.sender, tokenId);
        emit BuyToken(newTokenId);
        return newTokenId;
    }
}
