// artifacts.require でコンパイル済みのContractを読み込む
// 引数にはコントラクト名を指定する
const GreeterContract = artifacts.require('GreeterContract');

// テスト時に新しいコントラクトをデプロイするので、他のテストと状態を分けてテストが出来る
contract("GreeterContract", ()=>{
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