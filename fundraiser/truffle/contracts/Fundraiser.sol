pragma solidity >0.4.23 <=0.8.15;

contract Fundraiser {
    string public name;
    string public url;
    string public imageURL;
    string public description;

    constructor(
        string memory _name,
        string memory _url,
        string memory _imageURL,
        string memory _desctiption
    ) {
        name = _name;
        url = _url;
        imageURL = _imageURL;
        description = _desctiption;
    }
}
