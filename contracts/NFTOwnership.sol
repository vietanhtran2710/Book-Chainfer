// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract NFTOwnership is ERC721, AccessControl {
    bool isContractSet = false;
    address public ERC20_CONTRACT_ADDRESS;
    bytes32 public constant CONTRACT_ROLE = keccak256("CONTRACT");

    enum Right{ OWN, PUBLISH, READ_ONLY }

    // Optional mapping for token URIs - Book rights
    mapping(uint256 => Right) private _tokenRights;

    // Mapping from token ID to the book ID that it represents
    mapping(uint256 => uint256) private _tokenBooks;

    // Mapping from book ID to book title
    mapping(uint256 => string) private _bookTitles;

    // Mapping from owner to list of owned token IDs
    mapping(address => mapping(uint256 => uint256)) private _ownedTokens;

    //Mapping from token id to its selling price
    mapping(uint256 => uint256) private _tokenPrices;

    // Array with all token IDs, used for enumeration
    uint256[] private _allTokens;

    uint256 public bookCount;
    mapping(uint256 => uint256) private _bookTokenCount;
    mapping(uint256 => mapping(uint256 => uint256)) private _bookTokens;

    constructor() ERC721("BookOwnership", "BOOK") {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    function setContract(address _address)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
        returns (address)
    {
        require(
            (isContractSet == false) && (_address != address(0)),
            "Only set once"
        );
        grantRole(CONTRACT_ROLE, _address);
        isContractSet = true;
        ERC20_CONTRACT_ADDRESS = _address;
        return ERC20_CONTRACT_ADDRESS;
    }

    function getContractAdress() public view returns (address) {
        return ERC20_CONTRACT_ADDRESS;
    }

    function _mintToken(address to) private returns (uint256) {
        uint256 newTokenId = _allTokens.length;
        require(!_exists(newTokenId), "ERC721: duplicate tokenId");
        _mint(to, newTokenId);
        require(_exists(newTokenId), "ERC721: token minting failed");
        _addTokenToAllTokensEnumeration(newTokenId);
        _addTokenToOwnerEnumeration(to, newTokenId);
        return newTokenId;
    }

    function createBook(string memory title) public returns (uint256) {
        uint newTokenId = _mintToken(msg.sender);
        uint256 bookId = bookCount; bookCount++;
        _bookTitles[bookId] = title;
        _addTokenToBook(bookId, newTokenId);
        _setTokenRight(newTokenId, Right.OWN);
        return newTokenId;
    }

    function transferRight(address to, uint256 tokenId, Right bookRight) public returns (uint256) {
        require(_exists(tokenId), "Right token ID doesn't exist");
        require(to != msg.sender, "Can't create / transfer new right for your own account");
        require(ownerOf(tokenId) == msg.sender, "Sender doesn't own the token");
        if (bookRight == Right.PUBLISH) {
            require(_tokenRights[tokenId] == Right.OWN, "OWN token is required for publishing right transfer");
        }
        else if (bookRight == Right.READ_ONLY) {
            require(_tokenRights[tokenId] <= Right.PUBLISH, "PUBLISH / OWN token is required for reading right transfer");
        }
        uint256 newTokenId = _mintToken(to);
        uint256 currentBookId = _tokenBooks[tokenId];
        _addTokenToBook(currentBookId, newTokenId);
        _setTokenRight(newTokenId, bookRight);
        return newTokenId;
    }

    function getTokenRight(uint256 tokenId) public view virtual returns (Right) {
        require(_exists(tokenId), "ERC721URIStorage: Right query for non-existent token");
        return _tokenRights[tokenId];
    }

    function _setTokenRight(uint256 tokenId, Right _tokenRight) internal virtual {
        require(_exists(tokenId), "ERC721URIStorage: Right set of non-existent token");
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

    function getTokenBook(uint256 tokenId) public view returns (uint256) {
        require(_exists(tokenId), "ERC721URIStorage: Right query for non-existent token");
        return _tokenBooks[tokenId];
    }

    function getBookTitle(uint256 bookId) public view returns (string memory) {
        require(bookId < bookCount, "Index Error: bookId out of bounds");
        return _bookTitles[bookId];
    }

    function tokenOfOwnerByIndex(address owner, uint256 index) public view virtual returns (uint256) {
        require(index < balanceOf(owner), "ERC721Enumerable: owner's index out of bounds");
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
        _ownedTokens[to][length - 1] = tokenId;
    }

    function _addTokenToAllTokensEnumeration(uint256 tokenId) private {
        _allTokens.push(tokenId);
    }

    function getTokenPrice(uint256 tokenId) public view returns (uint256) {
        return _tokenPrices[tokenId];
    }

    function setTokenPrice(uint256 tokenId, uint256 price) public {
        require(ownerOf(tokenId) == msg.sender, "Sender doesn't own the token");
        _tokenPrices[tokenId] = price;
    }

    function sellReadToken(address to, uint256 sellerTokenId) public onlyRole(CONTRACT_ROLE) returns (uint256) {
        require(_tokenPrices[sellerTokenId] != 0, "Book is not for selling");
        uint256 newTokenId = _mintToken(to);
        uint256 currentBookId = _tokenBooks[sellerTokenId];
        _addTokenToBook(currentBookId, newTokenId);
        _setTokenRight(newTokenId, Right.READ_ONLY);
        return newTokenId;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}