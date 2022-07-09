pragma solidity ^0.8.15;
contract GreeterContract {
  string private _greeting = "Hello, World!";
  function greet() external view returns (string memory) {
    return _greeting;
  }

  function setGreeting(string calldata greeting) external {
    _greeting = greeting;
  }
}