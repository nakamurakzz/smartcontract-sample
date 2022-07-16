pragma solidity >0.4.23 <=0.8.15;
import "@openzeppelin/contracts/access/Ownable.sol";

contract Fundraiser is Ownable {
    struct Donation {
        uint256 value;
        uint256 date;
    }

    // キー：アドレスを寄付の配列に紐付けることが出来る
    // マッピングは列挙型ではないため、forループはできない
    // _donations[address]で寄付の履歴の配列を取得できる
    mapping(address => Donation[]) private _donations;

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

    function myDonationsCount() public view returns (uint256) {
        return _donations[msg.sender].length;
    }

    function donate() public payable {
        Donation memory donation = Donation({
            value: msg.value,
            date: block.timestamp
        });
        _donations[msg.sender].push(donation);
    }

    function myDonations() public view returns (
        uint256[] memory values, uint256[] memory dates
    ) {
        // マッピングは列挙型ではないため、↓のようにはかけない
        // values = _donations[msg.sender].map(donation => donation.value);

        uint256 count = myDonationsCount();
        values = new uint256[](count);
        dates = new uint256[](count);

        for (uint256 index = 0; index < count; index++) {
            values[index] = _donations[msg.sender][index].value;
            dates[index] = _donations[msg.sender][index].date;
        }
        return (values, dates);
    }
}
