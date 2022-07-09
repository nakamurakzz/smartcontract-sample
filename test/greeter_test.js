// artifacts.require でコンパイル済みのContractを読み込む
// 引数にはコントラクト名を指定する
const GreeterContract = artifacts.require('GreeterContract');

// テスト時に新しいコントラクトをデプロイするので、他のテストと状態を分けてテストが出来る
contract("GreeterContract", (accounts)=>{
  it("It has been deployed successfully", async ()=>{
    // ブロックチェーンのやり取りは全て非同期で行われる
    const greeter = await GreeterContract.deployed();
    assert(greeter, "contract was not deployed");
  })

  describe("greet", ()=>{
    it("should return Hello world", async ()=>{
      const greeter = await GreeterContract.deployed();
      const actual = await greeter.greet();
      assert.equal(actual, "Hello, World!", "greeted message is not correct");
    });
  });

  describe("owner", ()=>{
    it("returns the address of the owner", async ()=>{
      const greeter = await GreeterContract.deployed();
      const actual = await greeter.owner();
      assert(actual, "the current owner");
    });
    it("matches the address of the contract creator", async ()=>{
      const greeter = await GreeterContract.deployed();
      const actual = await greeter.owner();
      const expected = accounts[0];
      assert.equal(actual, expected, "the current owner is not the contract creator");
    });
  });
});

contract("GreeterContract", ()=>{
  it("Set greeting(string)", async ()=>{
    // ブロックチェーンのやり取りは全て非同期で行われる
    const greeter = await GreeterContract.deployed();
    await greeter.setGreeting("Hello, World!");
    const actual = await greeter.greet();
    assert.equal(actual, "Hello, World!", "greeted message is not correct");
  })
});

contract("Greeter: update greeting", (accounts)=>{
  describe("setGreeting(string)",()=>{
    it("sets greeting to passed in string", async () => {
      const greeter = await GreeterContract.deployed();
      const expected = "The owner changed the message"
      await greeter.setGreeting(expected);
      const actual = await greeter.greet();
      assert.equal(actual, expected, "greeted message is not correct");
    })
  })
  
  describe("when message is sent by author account",() => {
    it("dose not set the greeting", async () => {
      const greeter = await GreeterContract.deployed();
      const expected = await greeter.greet()
      try{
        await greeter.setGreeting("Not the owner", {from: accounts[1]});
      }catch(err){
        const errorMessage = "Ownable: caller is not the owner";
        assert.equal(err.reason, errorMessage, "error message is not correct");
        return;
      }
      assert(false, "greeting should not update");
    });
  });
});