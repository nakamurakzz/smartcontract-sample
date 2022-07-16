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

  describe("make donation", () => {
    const value = web3.utils.toWei('0.0289');
    const donor = accounts[2];

    it("increases myDonationsCount", async () => {
      const currentDonationsCount = await fundraiser.myDonationsCount({from:donor})
      await fundraiser.donate({from:donor, value});
      const newDonationsCount = await fundraiser.myDonationsCount({from:donor})      
      assert.equal(1,newDonationsCount - currentDonationsCount,"myDonationsCount should increase")
    });

    it("includes donation in myDonations", async () => {
      await fundraiser.donate({from:donor, value});
      const {values, dates} = await fundraiser.myDonations({from:donor})
      assert.equal(value,values[0],"value should match")
      assert(dates[0],"date should be set")
    });

    it("increase total donation", async () => {
      const currentTotalDonations = await fundraiser.totalDonations()
      await fundraiser.donate({from:donor, value});
      const newTotalDonations = await fundraiser.totalDonations()
      const diff = newTotalDonations - currentTotalDonations;
      assert.equal(diff,value,"total donation should match")
    });

    it("increase total donation counts", async () => {
      const currentTotalDonationCounts = await fundraiser.totalDonationCounts()
      await fundraiser.donate({from:donor, value});
      const newTotalDonationCounts = await fundraiser.totalDonationCounts()
      const diffCounts = newTotalDonationCounts - currentTotalDonationCounts;
      assert.equal(diffCounts,1,"total donation counts should match")
    });

    it("emits the DonationReceived event", async () => {
      const tx = await fundraiser.donate({from:donor, value});
      const expectedEvent = "DonationReceived"
      const actualEvent = tx.logs[0].event;
      assert.equal(actualEvent,expectedEvent,"event should match")
    });
  });

  describe("withdraw", () => {
    describe("access control", () => {
      it("thrown an error when cakked from a non-owner account", async () => {
        try{
          await fundraiser.withdraw({from:accounts[3]})
          assert.fail("should have thrown")  
        }catch(err){
          const expectedError = "RuntimeError"
          const actual = err.data.name;
          assert.equal(actual,expectedError,"should not be permitted")
        }
      });

      it("permits owner to withdraw", async () => {
        try{
          await fundraiser.withdraw({from:owner})
          assert(true,"no error thrown")
        }catch(err){
          assert.fail("should not have thrown")
        }
      });
    });

    describe("transfer to beneficiary", () => {
      it("transfer to beneficiary", async () => {
        const currentBalance = await web3.eth.getBalance(fundraiser.address)
        const currentBeneficiaryBalance = await web3.eth.getBalance(beneficiary);

        await fundraiser.withdraw({from:owner})

        const newBalance = await web3.eth.getBalance(fundraiser.address)
        const newBeneficiaryBalance = await web3.eth.getBalance(beneficiary);
        const diff = newBeneficiaryBalance - currentBeneficiaryBalance;
        assert.equal(newBalance,0,"balance should be 0")
        assert.equal(diff,currentBalance,"balance should match")
      });
    });

    it("emits Withdraw event", async() => {
      const tx = await fundraiser.withdraw({from:owner})
      const expectedEvent = "Withdraw"
      const actualEvent = tx.logs[0].event;

      assert.equal(actualEvent,expectedEvent,"event should match")
    });
  });
})