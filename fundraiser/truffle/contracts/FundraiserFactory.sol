pragma solidity >0.4.23 <=0.8.15;
import "./Fundraiser.sol";

contract FundraiserFactory {
    Fundraiser[] private _fundraiser;
    event FundraiserCreated(address fundraiser);

    function createFundraiser(
        string memory name,
        string memory url,
        string memory imageURL,
        string memory description,
        address payable beneficiary
    )
        public
    {
        Fundraiser fundraiser = new Fundraiser(
            name,
            url,
            imageURL,
            description,
            beneficiary,
            msg.sender
        );
        _fundraiser.push(fundraiser);
        emit FundraiserCreated(msg.sender);
    }

    function fundraisersCount() public view returns (uint256) {
        return _fundraiser.length;
    }
}
