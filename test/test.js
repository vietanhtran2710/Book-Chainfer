let book = artifacts.require("./NFTOwnership.sol");
let bookInstance;

contract('Book Contract', (accounts) => {
    it("Contract deployment", () => {
        return book.deployed().then((instance) => {
            bookInstance = instance;
            assert(bookInstance != undefined, "NFTOwnership should be defined and deployed")
        })
    });

    it("Token info", () => {
        return bookInstance.name().then((tokenName) => {
            assert(tokenName == "BookOwnership", "Token name should be BookOwnership");
            return bookInstance.symbol().then((tokenSymbol) => {
                assert(tokenSymbol == "BOOK", "Token symbol should be BOOK");
            })
        })
    })

    it("Book creation", async () => {
        await bookInstance.createBook("Red Dragon", {from: accounts[0]})
        return bookInstance.createBook("Hannibal", {from: accounts[0]})
        .then((receipt) => {
            let newTokenId = receipt.logs[0].args.tokenId.words[0];
            assert(newTokenId == 1, "New book token ID should be 1");
            return bookInstance.balanceOf(accounts[0]);
        })
        .then((balance) => {
            assert(balance == 2, "Account 0 balance should be 2");
            return bookInstance.ownerOf(0);
        })
        .then((owner) => {
            assert(owner == accounts[0], "Owner of token should be account 0");
            return bookInstance.getTokenRight(0);
        })
        .then((right) => {
            assert(right == 0, "Right of token should be OWN - 0");
            return bookInstance.getTokenBook(0)
        })
        .then((bookId) => {
            assert(bookId == 0, "Book ID shoule be 0");
            return bookInstance.getBookTokensCount(bookId);
        })
        .then((count) => {
            assert(count == 1, "Book's token count should be 1");
            return bookInstance.totalSupply();
        })
        .then((totalSupply) => {
            assert(totalSupply == 2, "Total supply of token should be 2");
        })
    })
    
    it("Book publish right transfer", async () => {
        return bookInstance.transferRight(accounts[1], 0, 1, {from: accounts[0]})
        .then((receipt) => {
            let newTokenId = receipt.logs[0].args.tokenId.words[0];
            assert(newTokenId == 2, "New book token ID should be 2");
            return bookInstance.balanceOf(accounts[1]);
        })
        .then((balance) => {
            assert(balance == 1, "Account 1 balance should be 1");
            return bookInstance.ownerOf(2);
        })
        .then((owner) => {
            assert(owner == accounts[1], "Owner of token should be account 1");
            return bookInstance.getTokenRight(2);
        })
        .then((right) => {
            assert(right == 1, "Right of token should be PUBLISH - 1");
            return bookInstance.getTokenBook(2)
        })
        .then((bookId) => {
            assert(bookId == 0, "Book ID should be 0");
            return bookInstance.getBookTokensCount(bookId);
        })
        .then((count) => {
            assert(count == 2, "Book's token count should be 2");
            return bookInstance.totalSupply();
        })
        .then((totalSupply) => {
            assert(totalSupply == 3, "Total supply of token should be 3");
        })
    })

    it("Book read only right transfer", async () => {
        return bookInstance.transferRight(accounts[2], 2, 2, {from: accounts[1]})
        .then((receipt) => {
            let newTokenId = receipt.logs[0].args.tokenId.words[0];
            assert(newTokenId == 3, "New book token ID should be 3");
            return bookInstance.balanceOf(accounts[2]);
        })
        .then((balance) => {
            assert(balance == 1, "Account 2 balance should be 1");
            return bookInstance.ownerOf(3);
        })
        .then((owner) => {
            assert(owner == accounts[2], "Owner of token should be account 2");
            return bookInstance.getTokenRight(3);
        })
        .then((right) => {
            assert(right == 2, "Right of token should be READ ONLY - 2");
            return bookInstance.getTokenBook(3)
        })
        .then((bookId) => {
            assert(bookId == 0, "Book ID should be 0");
            return bookInstance.getBookTokensCount(bookId);
        })
        .then((count) => {
            assert(count == 3, "Book's token count should be 3");
            return bookInstance.totalSupply();
        })
        .then((totalSupply) => {
            assert(totalSupply == 4, "Total supply of token should be 4");
        })
    })

    // Negative cases
    it("Should not transfer non-existing token right", () => {
        return bookInstance.transferRight(accounts[2], 10, 2, {from: accounts[0]})
        .then((result) => {
            throw("Non-existing token condition not implemented in Smart Contract");
        })
        .catch((error) => {
            if (error == "Non-existing token condition not implemented in Smart Contract") {
                assert("False");
            }
            else {
                assert("True");
            }
        })
    })

    it("Should not transfer to own account", () => {
        return bookInstance.transferRight(accounts[0], 1, 2, {from: accounts[0]})
        .then((result) => {
            throw("Own account transfer condition not implemented in Smart Contract");
        })
        .catch((error) => {
            if (error == "Own account transfer condition not implemented in Smart Contract") {
                assert("False");
            }
            else {
                assert("True");
            }
        })
    })

    it("Should not transfer wrong token right", () => {
        return bookInstance.transferRight(accounts[3], 3, 2, {from: accounts[2]})
        .then((result) => {
            throw("Wrong token condition not implemented in Smart Contract");
        })
        .catch((error) => {
            if (error == "Wrong token condition not implemented in Smart Contract") {
                assert("False");
            }
            else {
                assert("True");
                return bookInstance.transferRight(accounts[3], 2, 1, {from: accounts[1]});
            }
        })
        .then((result) => {
            throw("Wrong token condition not implemented in Smart Contract");
        })
        .catch((error) => {
            if (error == "Wrong token condition not implemented in Smart Contract") {
                assert("False");
            }
            else {
                assert("True");
            }
        })
    })

    it("Should not transfer a token that doesn't own", () => {
        return bookInstance.transferRight(accounts[3], 2, 2, {from: accounts[2]})
        .then((result) => {
            throw("Not owned token condition not implemented in Smart Contract");
        })
        .catch((error) => {
            if (error == "Not owned token condition not implemented in Smart Contract") {
                assert("False");
            }
            else {
                assert("True");
            }
        })
    })
})