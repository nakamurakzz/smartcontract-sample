const FundraiserFactoryContract = artifacts.require("FundraiserFactory")
const FundraiserContract = artifacts.require("Fundraiser")

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

  contract("FundraiserFactory: fundraisers", (accounts) => {
    async function createFundraiserFactory(count, accounts){
      const factory = await FundraiserFactoryContract.new()
      await addFundraisers(factory, count, accounts);
      return factory;
    }

    async function addFundraisers(factory, count, accounts){
      const name = "taro"
      const lowercaseName = name.toLowerCase()
      const beneficiary = accounts[1]

      for(let i = 0; i < count; i++){
        await factory.createFundraiser(
          `${name} ${i}`,
          `${lowercaseName}${i}.com`,
          `${lowercaseName}${i}.png`,
          `description ${name} ${i}`,
          beneficiary
        )
      }
    }

    describe("when fundraiserCollection is empty", () => {
      it("returns an empty array", async () => {
        const fundraiserFactory = await createFundraiserFactory(0, accounts)
        const fundraisers = await fundraiserFactory.fundraisers(10,0)
        assert.equal(
          fundraisers.length,
          0,
          "fundraisers should be empty"
        )
      });
    });

    describe("varying limits", async () => {
      let factory;
      beforeEach(async () => factory = await createFundraiserFactory(30, accounts));

      it("returns 10 fundraisers when limit is 10", async () => {
        const fundraisers = await factory.fundraisers(10,0)
        assert.equal(
          fundraisers.length,
          10,
          "fundraisers should be 10"
        );
      });

      xit("returns 20 fundraisers when limit is 20", async () => {
        const fundraisers = await factory.fundraisers(20,0)
        assert.equal(
          fundraisers.length,
          20,
          "fundraisers should be 20"
        );
      });

      xit("returns 20 fundraisers when limit is 30", async () => {
        const fundraisers = await factory.fundraisers(30,0)
        assert.equal(
          fundraisers.length,
          20,
          "fundraisers should be 20"
        );
      });
    });
    
    describe("varying offsets", async () => {
      let factory;
      beforeEach(async () => factory = await createFundraiserFactory(10, accounts));

      it("contains the fundraiser with the appropriate index", async () => {
        const fundraisers = await factory.fundraisers(1,0);
        const fundraiser = await FundraiserContract.at(fundraisers[0]);
        const name = await fundraiser.name();
        assert.ok(
          await name.includes(0),
          `${name} did not include the offset`
        );
      });

      it("contains the fundraiser with the appropriate index", async () => {
        const fundraisers = await factory.fundraisers(1,7);
        const fundraiser = await FundraiserContract.at(fundraisers[0]);
        const name = await fundraiser.name();
        assert.ok(
          await name.includes(7),
          `${name} did not include the offset`
        );
      });      
    });

    describe("boundary conditions", async () => {
      let factory;
      beforeEach(async () => factory = await createFundraiserFactory(10, accounts));

      it("raises out of bounds error", async () => {
        try {
          await factory.fundraisers(1,11);
          assert.fail("should have raised an error");
        } catch (err) {
          const expectedError = "offset out of bounds"
          assert.ok(err.message.includes(expectedError), `${err.message} should include ${expectedError}`)
        }
      });

      it("adjusts return size to prevent out of bounds error", async () => {
        try{
          const fundraisers = await factory.fundraisers(10,5);
          assert.equal(
            fundraisers.length,
            5,
            "fundraisers should be 5"
          );
        }catch(err){
          assert.fail("should not have raised an error");
        }
      });
    });
  });
});