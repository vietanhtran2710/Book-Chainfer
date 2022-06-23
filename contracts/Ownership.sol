pragma solidity 0.5.16;

contract Ownership {
    struct Book {
        uint Id;
        string title;
        mapping (address => uint) userToRight;
    }

    struct User {
        //3: own, 2: publish, 1: read only
        //Key is book ID, list of this user right to each book ID
        mapping (uint => uint) idToRight;
    }

    mapping (address => User) private userList;
    mapping (uint => Book) private bookList;

    uint public bookCount;

    function addBook(string memory title) public {
        bookCount++;
        Book storage newBook = bookList[bookCount++];
        newBook.Id = bookCount;
        newBook.title = title;
        newBook.userToRight[msg.sender] = 3;
        userList[msg.sender].idToRight[newBook.Id] = 3;
    }

    //give publishing right to an account
    function addPublisher(address publisher, uint bookId) public payable{
        require(msg.value >= 0.1 ether);
        assert(userList[msg.sender].idToRight[bookId] == 3);
        
        userList[publisher].idToRight[bookId] = 2;
        bookList[bookId].userToRight[publisher] = 2;
    }

    //give reader access to an account
    function addReader(address reader, uint bookId) public payable{
        require(msg.value >= 0.1 ether);
        assert(userList[msg.sender].idToRight[bookId] >= 2);
        
        userList[reader].idToRight[bookId] = 1;
        bookList[bookId].userToRight[reader] = 1;
    }

    function checkRightOnId(uint bookId) public view returns(uint right){
        return userList[msg.sender].idToRight[bookId];
    }

    function checkRightOfUser(uint bookId, address user) public view returns(uint right){
        return userList[user].idToRight[bookId];
    }

    function getUserRightToEveryBook(address user) public view returns(uint[] memory rightList) {
        uint[] memory result;
        for (uint i=1; i<=bookCount; i++) {
            result[i] = userList[user].idToRight[i];
        }
        return result;
    }

    constructor() public{
        addBook("Book 1");
        addBook("Book 2");
        addBook("Book 3");
        addBook("Book 4");
    }
}