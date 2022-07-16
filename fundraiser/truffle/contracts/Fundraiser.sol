pragma solidity >0.4.23 <=0.8.15;
import "@openzeppelin/contracts/access/Ownable.sol";

contract Fundraiser is Ownable {
    struct Donation {
        uint256 value;
        uint256 date;
    }

    // イベント定義
    // イベントは主にログを残す機能
    // indexed はEVMにおいてサブスクライバが自分に関係するかもしれないイベントを絞り込みやすくする ？
    event DonationReceived(address indexed donor, uint256 value);
    event Withdraw(uint256 amount);

    // キー：アドレスを寄付の配列に紐付けることが出来る
    // マッピングは列挙型ではないため、forループはできない
    // _donations[address]で寄付の履歴の配列を取得できる
    mapping(address => Donation[]) private _donations;

    // 状態変数
    string public name;
    string public url;
    string public imageURL;
    string public description;

    address payable public beneficiary;
    address public custodian;

    uint256 public totalDonations;
    uint256 public totalDonationCounts;

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
        totalDonations = 0;
        totalDonationCounts = 0;
    }

    function setBeneficiary(address payable _beneficiary) public onlyOwner {
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
        totalDonations += donation.value;
        totalDonationCounts++;
        _donations[msg.sender].push(donation);

        // DonationReceivedイベントを発行する
        emit DonationReceived(msg.sender, msg.value);
    }

    // フォールバック関数
    // Contractに無い関数が呼ばれた場合に呼ばれる
    // payableとするとEthを受け取ることができる
    // Etherを受け取るContractはfallback関数を実装するべき
    fallback () external payable {
        // Etherを受け取るためだけにフォールバックファンクションを実行したい場合
        require(msg.data.length == 0, "Fallback function only accepts ether");
        totalDonations += msg.value;
        totalDonationCounts++;
    }

    function myDonations()
        public
        view
        returns (uint256[] memory values, uint256[] memory dates)
    {
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

    function withdraw() public onlyOwner {
        // コントラクトの残高を取得
        uint256 blance = address(this).balance;
        beneficiary.transfer(blance);
        emit Withdraw(blance);
    }
}
