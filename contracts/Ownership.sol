// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Ownership {
    enum Right{ OWN, PUBLISH, READ_ONLY }

    struct Book {
        uint Id;
        string title;
        mapping (address => Right) userToRight;
    }

    struct User {
        // Key: book ID, Value: user right
        mapping (uint => Right) idToRight;
    }

    mapping (address => User) private userList;
    mapping (uint => Book) private bookList;

    uint public bookCount;

    function addBook(string memory title) public {
        bookCount++;
        Book storage newBook = bookList[bookCount++];
        newBook.Id = bookCount;
        newBook.title = title;
        newBook.userToRight[msg.sender] = Right.OWN;
        userList[msg.sender].idToRight[newBook.Id] = Right.OWN;
    }

    // Give publishing right to an account
    function addPublisher(address publisher, uint bookId) public payable{
        assert(userList[msg.sender].idToRight[bookId] == Right.OWN);
        
        userList[publisher].idToRight[bookId] = Right.PUBLISH;
        bookList[bookId].userToRight[publisher] = Right.PUBLISH;
    }

    // Give reader access to an account
    function addReader(address reader, uint bookId) public payable{
        assert(userList[msg.sender].idToRight[bookId] >= Right.PUBLISH);
        
        userList[reader].idToRight[bookId] = Right.READ_ONLY;
        bookList[bookId].userToRight[reader] = Right.READ_ONLY;
    }

    function checkRightOnId(uint bookId) public view returns(Right right){
        return userList[msg.sender].idToRight[bookId];
    }

    function checkRightOfUser(uint bookId, address user) public view returns(Right right){
        return userList[user].idToRight[bookId];
    }

    function getUserRightToEveryBook(address user) public view returns(Right[] memory rightList) {
        Right[] memory result;
        for (uint i = 1; i <= bookCount; i++) {
            result[i] = userList[user].idToRight[i];
        }
        return result;
    }

    constructor() {

    }
}