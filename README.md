# NFT_Marketplace
#### This is a demo NFT Marketplace for Digital Art
#
### Features
- Mint custom ERC721 tokens.
- Sell tokens on the marketplace.
- Set desired token price.
- Toggle between keeping the token for sale and not for sale.
- Keeps track of all the tokens owned by an account.
- Keeps track of minted and bought tokens
- Query functionality for token owner and token metadata.
#
#### Digi Art Marketplace Smart Contract is deployed to Rinkeby Testnet
### Run the DApp Locally
#### Install truffle
```
npm install -g truffle
```
#### Install ganache-cli
```
npm i ganache-cli
```
#### Run ganache-cli
```
ganache-cli --port 7545 
```
#### Open new terminal window and clone this repository
```
git clone https://github.com/kairavi28/NFT_Marketplace.git
```
#### Install dependencies
```
cd NFT_Marketplace
npm install
```
#### Compile smart contract
```
truffle compile
```
#### Deploy smart contract to ganache
```
truffle migrate
```
#### Test smart contract
```
truffle test
```
#### Start DApp
```
npm start
```
#### Open metamask browser wallet and connect network to Localhost 7545.
#### Import accounts from ganache-cli into the metamask browser wallet to make transactions on the DApp.