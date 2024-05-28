// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/access/Ownable.sol";

pragma solidity ^0.8.0;

interface IProfile {
    struct UserProfile {
        string displayName;
        string bio;
    }
    
    function getProfile(address _user) external view returns (UserProfile memory);
}

//content means password
contract PasswordManager is Ownable {

    struct Password {
        uint256 id;
        address author;
        string site;
        string username;
        string notes;
        string content;
        uint256 timestamp;
        bool deleted; // Track if the tweet is deleted
    }

    struct PasswordWithProfile {
        uint256 id;
        address author;
        string content;
        string site;
        string username;
        string notes;
        uint256 timestamp;
        string displayName;
    }

    mapping(address => Password[]) public passwords;
    address[] public users;
    mapping(address => bool) public hasCommited;

    IProfile profileContract;

    event PasswordCreated(uint256 id, address author, string content, string site,string username,string notes,uint256 timestamp);
    event PasswordDeleted(address author, uint256 passwordId);
    event PasswordEdited(address author, uint256 passwordId, string newContent);   //only password allowed to change

    modifier onlyRegistered() {
        IProfile.UserProfile memory userProfileTemp = profileContract.getProfile(msg.sender);
        require(bytes(userProfileTemp.displayName).length > 0, "USER NOT REGISTERED");
        _;
    }

    constructor(address _profileContract) Ownable(msg.sender) {
        profileContract = IProfile(_profileContract);
    }

    function createPassword(string memory _site,string memory _username, string memory _notes,string memory _password) public onlyRegistered {
        require(bytes(_password).length <= 100, "Too long!!!");
        require(bytes(_username).length <= 100, "Too long!!!");
        require(bytes(_site).length <= 100, "Too long!!!");
        require(bytes(_notes).length <= 200, "Too long!!!");


        Password memory newPassword = Password({
            id: passwords[msg.sender].length,
            author: msg.sender,
            content: _password,
            site:_site,
            username:_username,
            notes:_notes,
            timestamp: block.timestamp,
            deleted: false
        });

        passwords[msg.sender].push(newPassword);

        if (!hasCommited[msg.sender]) {
            users.push(msg.sender);
            hasCommited[msg.sender] = true;
        }

        emit PasswordCreated(newPassword.id, newPassword.author, newPassword.content,newPassword.site,newPassword.username,newPassword.notes,newPassword.timestamp);
    }

     function deletePassword(uint256 id) public {
        require(id < passwords[msg.sender].length, "PASSWORD DOES NOT EXIST");
        require(!passwords[msg.sender][id].deleted, "PASSWORD ALREADY DELETED");

        passwords[msg.sender][id].deleted = true;
        emit PasswordDeleted(msg.sender, id);
    }

    function editPassword(uint256 id, string memory newContent) public {
        require(id < passwords[msg.sender].length, "PASSWORD DOES NOT EXIST");
        require(!passwords[msg.sender][id].deleted, "PASSWORD IS DELETED");
        require(bytes(newContent).length <= 100, "PASSWORD is too long bro!");

        passwords[msg.sender][id].content = newContent;
        emit PasswordEdited(msg.sender, id, newContent);
    }
    

    function getPassword(uint _i) public view returns (Password memory) {
        require(_i < passwords[msg.sender].length, "PASSWORD DOES NOT EXIST");
        require(!passwords[msg.sender][_i].deleted, "PASSWORD IS DELETED");
        return passwords[msg.sender][_i];
    }

    function getAllPasswords(address _owner) public view returns (Password[] memory) {
    uint256 nonDeletedCount = 0;
    for (uint256 i = 0; i < passwords[_owner].length; i++) {
        if (!passwords[_owner][i].deleted) {
            nonDeletedCount++;
        }
    }

    Password[] memory nonDeletedPasswords = new Password[](nonDeletedCount);
    uint256 index = 0;
    for (uint256 i = 0; i < passwords[_owner].length; i++) {
        if (!passwords[_owner][i].deleted) {
            nonDeletedPasswords[index] = passwords[_owner][i];
            index++;
        }
    }

    return nonDeletedPasswords;
}



   
}
