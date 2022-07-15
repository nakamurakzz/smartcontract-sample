pragma solidity >0.4.23 <=0.8.15;
import "@openzeppelin/contracts/access/Ownable.sol";

contract Fundraiser is Ownable {
    string public name;
    string public url;
    string public imageURL;
    string public description;

    address payable public beneficiary;
    address public custodian;

    constructor(
        string memory _name,
        string memory _url,
        string memory _imageURL,
        string memory _desctiption,
        address payable _beneficiary,
        address _custodian
    ) public {
        name = _name;
        url = _url;
        imageURL = _imageURL;
        description = _desctiption;
        beneficiary = _beneficiary;
        transferOwnership(_custodian);
    }

    function setBeneficiary (address payable _beneficiary) public onlyOwner {
        beneficiary = _beneficiary;
    }
}
