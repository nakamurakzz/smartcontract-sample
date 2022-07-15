const FundraiserContract = artifacts.require("Fundraiser")

contract("Fundraiser", accounts => {
  let fundraiser
  const name = "taro"
  const url = "example.com"
  const imageURL = "https://placelitten.com/600/350"
  const description = "desctiption"
  const beneficiary = accounts[1]
  const owner = accounts[0]

  beforeEach(async () => {
    fundraiser = await FundraiserContract.new(name,url,imageURL,description,beneficiary,owner)
  })

  describe("init", () => {
    it("get name", async () => {
      const actual = await fundraiser.name()
      assert.equal(actual,name,"names should match")
    })

    it("get url", async () => {
      const actual = await fundraiser.url()
      assert.equal(actual,url,"url should match")
    })

    it("get imageURL", async () => {
      const actual = await fundraiser.imageURL()
      assert.equal(actual,imageURL,"imageURL should match")
    })
    it("get description", async () => {
      const actual = await fundraiser.description()
      assert.equal(actual,description,"desctiption should match")
    })

    it("get beneficiary", async () => {
      const actual = await fundraiser.beneficiary()
      assert.equal(actual,beneficiary,"beneficiary should match")
    });

    it("get owner", async () => {
      const actual = await fundraiser.owner()
      assert.equal(actual,owner,"owner should match")
    });
  })

  describe("set beneficiary", () => {
    const newBeneficiary = accounts[2]

    it("update beneficiary when called by owner account", async () => {
      await fundraiser.setBeneficiary(newBeneficiary,{from:owner})
      const actual = await fundraiser.beneficiary()
      assert.equal(actual,newBeneficiary,"beneficiary should match")
    });

    it("throw when called by non-owner account", async () => {
      try{
        await fundraiser.setBeneficiary(newBeneficiary,{from:accounts[3]})
        assert.fail("should have thrown")  
      }catch(err){
        const expectedError = "RuntimeError"
        const actual = err.data.name;
        assert.equal(actual,expectedError,"should not be permitted")
      }
    });
  });
})