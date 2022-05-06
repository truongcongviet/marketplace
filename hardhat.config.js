require("@nomiclabs/hardhat-waffle");

const projectId = "a70bc220677f403aaee0cb262c411c05";
const fs = require("fs");
const privateKey = fs.readFileSync(".secret").toString();

module.exports = {
  networks: {
    hardhat:{
      chainId: 1337
    },
    mumbai:{
      url: `https://polygon-mumbai.infura.io/v3/${projectId}`,
      account: [privateKey]
    },
    mainnet:{
      url: `https://polygon-mainnet.infura.io/v3/${projectId}`,
      account: [privateKey]
    }
  },
  solidity: "0.8.4",
};
