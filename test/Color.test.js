const assert = require("assert");

const Color = artifacts.require("Color");

contract("Color", (accounts) => {
  let Contract;

  before(async () => {
    Contract = await Color.deployed();
  });
  describe("deployment", async () => {
    it("deploy Success", async () => {
      const address = Contract.address;
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it("has a name", async () => {
      const name = await Contract.name();
      console.log("name", name);
      assert.equal(name, "Color");
    });
  });

  describe("minting", async () => {
    const result = await Contract.mint("#EC0583");
    const totalSupply = await Contract.totalSupply();
    assert.equal(totalSupply, 1);
    const event = result.logs[0].args;
    assert.equal(event.tokenId.toNumber(), 1, "id is correct");
  });
});
