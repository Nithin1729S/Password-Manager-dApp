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

contract Twitter is Ownable {

    uint16 public MAX_TWEET_LENGTH = 280;

    struct Tweet {
        uint256 id;
        address author;
        string content;
        uint256 timestamp;
        uint256 likes;
        bool deleted; // Track if the tweet is deleted
    }

    struct TweetWithProfile {
        uint256 id;
        address author;
        string content;
        uint256 timestamp;
        uint256 likes;
        string displayName;
    }

    mapping(address => Tweet[]) public tweets;
    address[] public users;
    mapping(address => bool) public hasTweeted;

    IProfile profileContract;

    event TweetCreated(uint256 id, address author, string content, uint256 timestamp);
    event TweetLiked(address liker, address tweetAuthor, uint256 tweetId, uint256 newLikeCount);
    event TweetUnliked(address unliker, address tweetAuthor, uint256 tweetId, uint256 newLikeCount);
    event TweetDeleted(address author, uint256 tweetId);
    event TweetEdited(address author, uint256 tweetId, string newContent);

    modifier onlyRegistered() {
        IProfile.UserProfile memory userProfileTemp = profileContract.getProfile(msg.sender);
        require(bytes(userProfileTemp.displayName).length > 0, "USER NOT REGISTERED");
        _;
    }

    constructor(address _profileContract) Ownable(msg.sender) {
        profileContract = IProfile(_profileContract);
    }

    function changeTweetLength(uint16 newTweetLength) public onlyOwner {
        MAX_TWEET_LENGTH = newTweetLength;
    }

    function getTotalLikes(address _author) external view returns (uint) {
        uint totalLikes;
        for (uint i = 0; i < tweets[_author].length; i++) {
            if (!tweets[_author][i].deleted) {
                totalLikes += tweets[_author][i].likes;
            }
        }
        return totalLikes;
    }

    function createTweet(string memory _tweet) public onlyRegistered {
        require(bytes(_tweet).length <= MAX_TWEET_LENGTH, "Tweet is too long bro!");

        Tweet memory newTweet = Tweet({
            id: tweets[msg.sender].length,
            author: msg.sender,
            content: _tweet,
            timestamp: block.timestamp,
            likes: 0,
            deleted: false
        });

        tweets[msg.sender].push(newTweet);

        if (!hasTweeted[msg.sender]) {
            users.push(msg.sender);
            hasTweeted[msg.sender] = true;
        }

        emit TweetCreated(newTweet.id, newTweet.author, newTweet.content, newTweet.timestamp);
    }

    function likeTweet(address author, uint256 id) external onlyRegistered {
        require(id < tweets[author].length, "TWEET DOES NOT EXIST");
        require(!tweets[author][id].deleted, "TWEET IS DELETED");

        tweets[author][id].likes++;
        emit TweetLiked(msg.sender, author, id, tweets[author][id].likes);
    }

    function unlikeTweet(address author, uint256 id) external onlyRegistered {
        require(id < tweets[author].length, "TWEET DOES NOT EXIST");
        require(!tweets[author][id].deleted, "TWEET IS DELETED");
        require(tweets[author][id].likes > 0, "TWEET HAS NO LIKES");

        tweets[author][id].likes--;
        emit TweetUnliked(msg.sender, author, id, tweets[author][id].likes);
    }

    function getTweet(uint _i) public view returns (Tweet memory) {
        require(_i < tweets[msg.sender].length, "TWEET DOES NOT EXIST");
        require(!tweets[msg.sender][_i].deleted, "TWEET IS DELETED");
        return tweets[msg.sender][_i];
    }

    function getAllTweets(address _owner) public view returns (Tweet[] memory) {
        return tweets[_owner];
    }

    function getAllTweets() public view returns (TweetWithProfile[] memory) {
        uint totalTweets = 0;
        for (uint i = 0; i < users.length; i++) {
            totalTweets += tweets[users[i]].length;
        }

        TweetWithProfile[] memory allTweetsWithProfile = new TweetWithProfile[](totalTweets);
        uint currentIndex = 0;

        for (uint i = 0; i < users.length; i++) {
            IProfile.UserProfile memory userProfile = profileContract.getProfile(users[i]);
            for (uint j = 0; j < tweets[users[i]].length; j++) {
                if (!tweets[users[i]][j].deleted) {
                    Tweet memory tweet = tweets[users[i]][j];
                    allTweetsWithProfile[currentIndex] = TweetWithProfile({
                        id: tweet.id,
                        author: tweet.author,
                        content: tweet.content,
                        timestamp: tweet.timestamp,
                        likes: tweet.likes,
                        displayName: userProfile.displayName
                    });
                    currentIndex++;
                }
            }
        }

        return allTweetsWithProfile;
    }

    function deleteTweet(uint256 id) public {
        require(id < tweets[msg.sender].length, "TWEET DOES NOT EXIST");
        require(!tweets[msg.sender][id].deleted, "TWEET ALREADY DELETED");

        tweets[msg.sender][id].deleted = true;
        emit TweetDeleted(msg.sender, id);
    }

    function editTweet(uint256 id, string memory newContent) public {
        require(id < tweets[msg.sender].length, "TWEET DOES NOT EXIST");
        require(!tweets[msg.sender][id].deleted, "TWEET IS DELETED");
        require(bytes(newContent).length <= MAX_TWEET_LENGTH, "Tweet is too long bro!");

        tweets[msg.sender][id].content = newContent;
        emit TweetEdited(msg.sender, id, newContent);
    }
}
