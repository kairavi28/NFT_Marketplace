import './App.css';
import React, { Component } from "react";
import { HashRouter, Route } from "react-router-dom";
import Web3 from "web3";
import DigiArt from "./abis/DigiArt.json";
import FormAndPreview from "./components/FormAndPreview";
import AllArt from "./components/AllArt";
import AccountDetails from "./components/AccountDetails";
import ContractNotDeployed from "./components/ContractNotDeployed";
import ConnectToMetamask from "./components/ConnectToMetamask";
import Loading from "./components/Loading";
import Navbar from "./components/Navbar";
import MyTokens from "./components/MyTokens";
import Queries from "./components/Queries";

const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accountAddress: "",
      accountBalance: "",
      DigiArtContract: null,
      digiArtCount: 0,
      digiarts: [],
      loading: true,
      metamaskConnected: false,
      contractDetected: false,
      totalTokensMinted: 0,
      totalTokensOwnedByAccount: 0,
      nameIsUsed: false,
      colorIsUsed: false,
      colorsUsed: [],
      lastMintTime: null,
    };
  }

  componentWillMount = async () => {
    await this.loadWeb3();
    await this.loadBlockchainData();
    await this.setMetaData();
    await this.setMintBtnTimer();
  };

  setMintBtnTimer = () => {
    const mintBtn = document.getElementById("mintBtn");
    if (mintBtn !== undefined && mintBtn !== null) {
      this.setState({
        lastMintTime: localStorage.getItem(this.state.accountAddress),
      });
      this.state.lastMintTime === undefined || this.state.lastMintTime === null
        ? (mintBtn.innerHTML = "Mint My Token")
        : this.checkIfCanMint(parseInt(this.state.lastMintTime));
    }
  };

  checkIfCanMint = (lastMintTime) => {
    const mintBtn = document.getElementById("mintBtn");
    const timeGap = 300000; //5min in milliseconds
    const countDownTime = lastMintTime + timeGap;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = countDownTime - now;
      if (diff < 0) {
        mintBtn.removeAttribute("disabled");
        mintBtn.innerHTML = "Mint My Token";
        localStorage.removeItem(this.state.accountAddress);
        clearInterval(interval);
      } else {
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        mintBtn.setAttribute("disabled", true);
        mintBtn.innerHTML = `Next mint in ${minutes}m ${seconds}s`;
      }
    }, 1000);
  };

  loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  loadBlockchainData = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) {
      this.setState({ metamaskConnected: false });
    } else {
      this.setState({ metamaskConnected: true });
      this.setState({ loading: true });
      this.setState({ accountAddress: accounts[0] });
      let accountBalance = await web3.eth.getBalance(accounts[0]);
      accountBalance = web3.utils.fromWei(accountBalance, "Ether");
      this.setState({ accountBalance });
      this.setState({ loading: false });
      const networkId = await web3.eth.net.getId();
      const networkData = DigiArt.networks[networkId];
      if (networkData) {
        this.setState({ loading: true });
        const DigiArtContract = web3.eth.Contract(
          DigiArt.abi,
          networkData.address
        );
        this.setState({ DigiArtContract });
        this.setState({ contractDetected: true });
        const digiArtCount = await DigiArtContract.methods
          .artCounter()
          .call();
        this.setState({ digiArtCount });
        for (var i = 1; i <= digiArtCount; i++) {
          const digi = await DigiArtContract.methods
            .allArtPieces(i)
            .call();
          this.setState({
            digiarts: [...this.state.digiarts, digi],
          });
        }
        let totalTokensMinted = await DigiArtContract.methods
          .getNumberOfTokensMinted()
          .call();
        totalTokensMinted = totalTokensMinted.toNumber();
        this.setState({ totalTokensMinted });
        let totalTokensOwnedByAccount = await DigiArtContract.methods
          .getTotalNumberOfTokensOwnedByAnAddress(this.state.accountAddress)
          .call();
        totalTokensOwnedByAccount = totalTokensOwnedByAccount.toNumber();
        this.setState({ totalTokensOwnedByAccount });
        this.setState({ loading: false });
      } else {
        this.setState({ contractDetected: false });
      }
    }
  };

  connectToMetamask = async () => {
    await window.ethereum.enable();
    this.setState({ metamaskConnected: true });
    window.location.reload();
  };

  setMetaData = async () => {
    if (this.state.digiarts.length !== 0) {
      this.state.digiarts.map(async (digit) => {
        const result = await fetch(digit.tokenURI);
        const metaData = await result.json();
        this.setState({
          digiarts: this.state.digiarts.map((digit) =>
          digit.tokenId.toNumber() === Number(metaData.tokenId)
              ? {
                  ...digit,
                  metaData,
                }
              : digit
          ),
        });
      });
    }
  };

  mintMyNFT = async (colors, name, tokenPrice) => {
    this.setState({ loading: true });
    const colorsArray = Object.values(colors);
    let colorsUsed = [];
    for (let i = 0; i < colorsArray.length; i++) {
      if (colorsArray[i] !== "") {
        let colorIsUsed = await this.state.DigiArtContract.methods
          .colorExists(colorsArray[i])
          .call();
        if (colorIsUsed) {
          colorsUsed = [...colorsUsed, colorsArray[i]];
        } else {
          continue;
        }
      }
    }
    const nameIsUsed = await this.state.DigiArtContract.methods
      .tokenNameExists(name)
      .call();
      if (colorsUsed.length === 0 && !nameIsUsed) {
      const {
        cardBorderColor,
        cardBackgroundColor,
        headBorderColor,
        headBackgroundColor,
        leftEyeBorderColor,
        rightEyeBorderColor,
        leftEyeBackgroundColor,
        rightEyeBackgroundColor,
        leftPupilBackgroundColor,
        rightPupilBackgroundColor,
        mouthColor,
        neckBackgroundColor,
        neckBorderColor,
        bodyBackgroundColor,
        bodyBorderColor,
      } = colors;
      let previousTokenId;
      previousTokenId = await this.state.DigiArtContract.methods
        .artCounter()
        .call();
      previousTokenId = previousTokenId.toNumber();
      const tokenId = previousTokenId + 1;
      const tokenObject = {
        tokenName: "myNFT",
        tokenSymbol: "DA",
        tokenId: `${tokenId}`,
        name: name,
        metaData: {
          type: "color",
          colors: {
            cardBorderColor,
            cardBackgroundColor,
            headBorderColor,
            headBackgroundColor,
            leftEyeBorderColor,
            rightEyeBorderColor,
            leftEyeBackgroundColor,
            rightEyeBackgroundColor,
            leftPupilBackgroundColor,
            rightPupilBackgroundColor,
            mouthColor,
            neckBackgroundColor,
            neckBorderColor,
            bodyBackgroundColor,
            bodyBorderColor,
          },
        },
      };
      const cid = await ipfs.add(JSON.stringify(tokenObject));
      let tokenURI = `https://ipfs.infura.io/ipfs/${cid.path}`;
      const price = window.web3.utils.toWei(tokenPrice.toString(), "Ether");
      this.state.DigiArtContract.methods
        .mintNFT(name, tokenURI, price, colorsArray)
        .send({ from: this.state.accountAddress })
        .on("confirmation", () => {
          localStorage.setItem(this.state.accountAddress, new Date().getTime());
          this.setState({ loading: false });
          window.location.reload();
        });
    } else {
      if (nameIsUsed) {
        this.setState({ nameIsUsed: true });
        this.setState({ loading: false });
      } else if (colorsUsed.length !== 0) {
        this.setState({ colorIsUsed: true });
        this.setState({ colorsUsed });
        this.setState({ loading: false });
      }
    }
  };

  toggleForSale = (tokenId) => {
    this.setState({ loading: true });
    this.state.DigiArtContract.methods
      .toggleForSale(tokenId)
      .send({ from: this.state.accountAddress })
      .on("confirmation", () => {
        this.setState({ loading: false });
        window.location.reload();
      });
  };

  changeTokenPrice = (tokenId, newPrice) => {
    this.setState({ loading: true });
    const newTokenPrice = window.web3.utils.toWei(newPrice, "Ether");
    this.state.DigiArtContract.methods
      .changeTokenPrice(tokenId, newTokenPrice)
      .send({ from: this.state.accountAddress })
      .on("confirmation", () => {
        this.setState({ loading: false });
        window.location.reload();
      });
  };

  buyToken = (tokenId, price) => {
    this.setState({ loading: true });
    this.state.DigiArtContract.methods
      .buyToken(tokenId)
      .send({ from: this.state.accountAddress, value: price })
      .on("confirmation", () => {
        this.setState({ loading: false });
        window.location.reload();
      });
  };

  render() {
    return (
      <div className="container">
        {!this.state.metamaskConnected ? (
          <ConnectToMetamask connectToMetamask={this.connectToMetamask} />
        ) : !this.state.contractDetected ? (
          <ContractNotDeployed />
        ) : this.state.loading ? (
          <Loading />
        ) : (
          <>
            <HashRouter basename="/">
              <Navbar />
              <Route
                path="/"
                exact
                render={() => (
                  <AccountDetails
                    accountAddress={this.state.accountAddress}
                    accountBalance={this.state.accountBalance}
                  />
                )}
              />
              <Route
                path="/mint"
                render={() => (
                  <FormAndPreview
                    mintMyNFT={this.mintMyNFT}
                    nameIsUsed={this.state.nameIsUsed}
                    colorIsUsed={this.state.colorIsUsed}
                    colorsUsed={this.state.colorsUsed}
                    setMintBtnTimer={this.setMintBtnTimer}
                  />
                )}
              />
              <Route
                path="/marketplace"
                render={() => (
                  <AllArt
                    digiarts={this.state.digiarts}
                    accountAddress={this.state.accountAddress}
                    totalTokensMinted={this.state.totalTokensMinted}
                    changeTokenPrice={this.changeTokenPrice}
                    toggleForSale={this.toggleForSale}
                    buyToken={this.buyToken}
                  />
                )}
              />
              <Route
                path="/my-tokens"
                render={() => (
                  <MyTokens
                    accountAddress={this.state.accountAddress}
                    digiarts={this.state.digiarts}
                    totalTokensOwnedByAccount={
                      this.state.totalTokensOwnedByAccount
                    }
                  />
                )}
              />
              <Route
                path="/queries"
                render={() => (
                  <Queries DigiArtContract={this.state.DigiArtContract} />
                )}
              />
            </HashRouter>
          </>
        )}
      </div>
    );
  }
}

export default App;
