// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Ownership is ERC721 {
    enum Right{ OWN, PUBLISH, READ_ONLY }

    // Optional mapping for token URIs - Book rights
    mapping(uint256 => Right) private _tokenRights;

    // Mappring from token ID to the book ID that it represents
    mapping(uint256 => uint256) private _tokenBooks;

    // Mapping from book id to book title
    mapping(uint256 => string) private _bookTitles;

    // Mapping from owner to list of owned token IDs
    mapping(address => mapping(uint256 => uint256)) private _ownedTokens;

    // Array with all token ids, used for enumeration
    uint256[] private _allTokens;

    uint256 bookCount;
    mapping(uint256 => uint256) private _bookTokenCount;
    mapping(uint256 => mapping(uint256 => uint256)) private _bookTokens;


    constructor() ERC721("BookOwnership", "BOOK") {
    }

    function _mintToken(address to) private returns (uint256) {
        uint256 newTokenId = _allTokens.length;
        _mint(to, newTokenId);
        require(_exists(newTokenId), "ERC721: token minting failed");
        _addTokenToAllTokensEnumeration(newTokenId);
        _addTokenToOwnerEnumeration(to, newTokenId);
        return newTokenId;
    }

    function createBook(string memory title) public payable returns (uint256) {
        uint newTokenId = _mintToken(msg.sender);
        uint256 bookId = bookCount; bookCount++;
        _bookTitles[bookId] = title;
        _addTokenToBook(bookId, newTokenId);
        _setTokenRight(newTokenId, Right.OWN);
        return newTokenId;
    }

    function transferRight(address to, uint256 tokenId, Right bookRight) public payable returns (uint256) {
        require(_exists(tokenId), "Current right token doesn't exist");
        require(to != msg.sender, "Can't create new right to own self");
        require(ownerOf(tokenId) == msg.sender, "Sender doesn't own the token");
        if (bookRight == Right.PUBLISH) {
            require(_tokenRights[tokenId] == Right.OWN, "Current token is not own");
        }
        else if (bookRight == Right.READ_ONLY) {
            require(_tokenRights[tokenId] == Right.PUBLISH, "Current token is not publish");
        }
        uint256 newTokenId = _mintToken(to);
        uint256 currentBookId = _tokenBooks[tokenId];
        _addTokenToBook(currentBookId, newTokenId);
        _setTokenRight(newTokenId, bookRight);
        return newTokenId;
    }

    function tokenRight(uint256 tokenId) public view virtual returns (Right) {
        require(_exists(tokenId), "ERC721URIStorage: Right query for nonexistent token");
        return _tokenRights[tokenId];
    }

    function _setTokenRight(uint256 tokenId, Right _tokenRight) internal virtual {
        require(_exists(tokenId), "ERC721URIStorage: Right set of nonexistent token");
        _tokenRights[tokenId] = _tokenRight;
    }

    function getBookTokensCount(uint256 bookId) public view returns (uint256) {
        return _bookTokenCount[bookId];
    }

    function _addTokenToBook(uint256 bookId, uint256 tokenId) private {
        _tokenBooks[tokenId] = bookId;
        _bookTokenCount[bookId] += 1;
        uint256 length = getBookTokensCount(bookId);
        _bookTokens[bookId][length] = tokenId;
    }

    function tokenOfOwnerByIndex(address owner, uint256 index) public view virtual returns (uint256) {
        require(index < balanceOf(owner), "ERC721Enumerable: owner index out of bounds");
        return _ownedTokens[owner][index];
    }

    function totalSupply() public view virtual returns (uint256) {
        return _allTokens.length;
    }

    function tokenByIndex(uint256 index) public view virtual returns (uint256) {
        require(index < totalSupply(), "ERC721Enumerable: global index out of bounds");
        return _allTokens[index];
    }

    function _addTokenToOwnerEnumeration(address to, uint256 tokenId) private {
        uint256 length = balanceOf(to);
        _ownedTokens[to][length] = tokenId;
    }

    function _addTokenToAllTokensEnumeration(uint256 tokenId) private {
        _allTokens.push(tokenId);
    }
}