pragma solidity >0.4.23 <=0.8.15;
import "./Fundraiser.sol";

contract FundraiserFactory {
    Fundraiser[] private _fundraiser;
    event FundraiserCreated(address fundraiser);

    uint256 constant maxLimit = 20;

    function createFundraiser(
        string memory name,
        string memory url,
        string memory imageURL,
        string memory description,
        address payable beneficiary
    ) public {
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

    function fundraisers(uint256 limit, uint256 offset)
        public
        view
        returns (Fundraiser[] memory coll)
    {
        require(offset <= fundraisersCount(), "offset out of bounds");

        uint256 size = fundraisersCount() - offset;
        size = size < limit ? size : limit;
        size = size < maxLimit ? size : maxLimit;
        coll = new Fundraiser[](size);

        for (uint256 index = 0; index < size; index++) {
            coll[index] = _fundraiser[offset + index];
        }
        return coll;
    }
}
