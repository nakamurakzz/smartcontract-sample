const FundraiserFactoryContract = artifacts.require("FundraiserFactory")

contract("FundraiserFactory: deployment", () => {
  it("has been deployed", async () => {
    const fundraiserFactory = await FundraiserFactoryContract.deployed()
    assert(fundraiserFactory, "fundraiserFactory should be deployed")
  });
});

contract("FundraiserFactory: createFundraiser", (accounts) => {
  const name = "taro"
  const url = "example.com"
  const imageURL = "https://placelitten.com/600/350"
  const description = "desctiption"
  const beneficiary = accounts[1]

  it("increments the fundraiserCount", async () => {
    const fundraiserFactory = await FundraiserFactoryContract.deployed()
    const currentCount = await fundraiserFactory.fundraisersCount()
    await fundraiserFactory.createFundraiser(
      name,
      url,
      imageURL,
      description,
      beneficiary
    );
    const newCount = await fundraiserFactory.fundraisersCount()
    assert.equal(
      newCount - currentCount,
      1,
      "fundraiserCount should increment"
    );
  });

  it("emits a FundraiserCreated event", async () => {
    fundraiserFactory = await FundraiserFactoryContract.deployed()
    const tx = await fundraiserFactory.createFundraiser(
      name,
      url,
      imageURL,
      description,
      beneficiary
    );
    const expectedEvent = "FundraiserCreated"
    const actualEvent = tx.logs[0].event;
    assert.equal(actualEvent, expectedEvent, "event should be FundraiserCreated")
  });
});