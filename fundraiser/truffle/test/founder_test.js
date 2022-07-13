const FundraiserContract = artifacts.require("Fundraiser")

contract("Fundraiser", accounts => {
  let fundraiser
  const name = "taro"
  const url = "example.com"
  const imageURL = "https://placelitten.com/600/350"
  const description = "desctiption"

  describe("init", () => {
    beforeEach(async () => {
      fundraiser = await FundraiserContract.new(name,url,imageURL,description)
    })

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
  })
})