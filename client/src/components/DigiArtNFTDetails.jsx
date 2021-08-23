import React, { Component } from "react";

class DigiArtNFTDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newTokenPrice: "",
    };
  }

  callChangeTokenPriceFromApp = (tokenId, newPrice) => {
    this.props.changeTokenPrice(tokenId, newPrice);
  };

  render() {
    return (
      <div key={this.props.arts.tokenId.toNumber()} className="mt-4">
        <p>
          <span className="font-weight-bold">Token Id</span> :{" "}
          {this.props.arts.tokenId.toNumber()}
        </p>
        <p>
          <span className="font-weight-bold">Name</span> :{" "}
          {this.props.arts.tokenName}
        </p>
        <p>
          <span className="font-weight-bold">Minted By</span> :{" "}
          {this.props.arts.mintedBy.substr(0, 5) +
            "..." +
            this.props.arts.mintedBy.slice(
              this.props.arts.mintedBy.length - 5
            )}
        </p>
        <p>
          <span className="font-weight-bold">Owned By</span> :{" "}
          {this.props.arts.currentOwner.substr(0, 5) +
            "..." +
            this.props.arts.currentOwner.slice(
              this.props.arts.currentOwner.length - 5
            )}
        </p>
        <p>
          <span className="font-weight-bold">Previous Owner</span> :{" "}
          {this.props.arts.previousOwner.substr(0, 5) +
            "..." +
            this.props.arts.previousOwner.slice(
              this.props.arts.previousOwner.length - 5
            )}
        </p>
        <p>
          <span className="font-weight-bold">Price</span> :{" "}
          {window.web3.utils.fromWei(
            this.props.arts.price.toString(),
            "Ether"
          )}{" "}
          Ξ
        </p>
        <p>
          <span className="font-weight-bold">No. of Transfers</span> :{" "}
          {this.props.arts.numberOfTransfers.toNumber()}
        </p>
        <div>
          {this.props.accountAddress === this.props.arts.currentOwner ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                this.callChangeTokenPriceFromApp(
                  this.props.arts.tokenId.toNumber(),
                  this.state.newTokenPrice
                );
              }}
            >
              <div className="form-group mt-4 ">
                <label htmlFor="newTokenPrice">
                  <span className="font-weight-bold">Change Token Price</span> :
                </label>{" "}
                <input
                  required
                  type="number"
                  name="newTokenPrice"
                  id="newTokenPrice"
                  value={this.state.newTokenPrice}
                  className="form-control w-50"
                  placeholder="Enter new price"
                  onChange={(e) =>
                    this.setState({
                      newTokenPrice: e.target.value,
                    })
                  }
                />
              </div>
              <button
                type="submit"
                style={{ fontSize: "0.8rem", letterSpacing: "0.14rem" }}
                className="btn btn-outline-info mt-0 w-50"
              >
                change price
              </button>
            </form>
          ) : null}
        </div>
        <div>
          {this.props.accountAddress === this.props.arts.currentOwner ? (
            this.props.arts.forSale ? (
              <button
                className="btn btn-outline-danger mt-4 w-50"
                style={{ fontSize: "0.8rem", letterSpacing: "0.14rem" }}
                onClick={() =>
                  this.props.toggleForSale(
                    this.props.arts.tokenId.toNumber()
                  )
                }
              >
                Remove from sale
              </button>
            ) : (
              <button
                className="btn btn-outline-success mt-4 w-50"
                style={{ fontSize: "0.8rem", letterSpacing: "0.14rem" }}
                onClick={() =>
                  this.props.toggleForSale(
                    this.props.arts.tokenId.toNumber()
                  )
                }
              >
                Keep for sale
              </button>
            )
          ) : null}
        </div>
        <div>
          {this.props.accountAddress !== this.props.arts.currentOwner ? (
            this.props.arts.forSale ? (
              <button
                className="btn btn-outline-primary mt-3 w-50"
                value={this.props.arts.price}
                style={{ fontSize: "0.8rem", letterSpacing: "0.14rem" }}
                onClick={(e) =>
                  this.props.buyToken(
                    this.props.arts.tokenId.toNumber(),
                    e.target.value
                  )
                }
              >
                Buy For{" "}
                {window.web3.utils.fromWei(
                  this.props.arts.price.toString(),
                  "Ether"
                )}{" "}
                Ξ
              </button>
            ) : (
              <>
                <button
                  disabled
                  style={{ fontSize: "0.8rem", letterSpacing: "0.14rem" }}
                  className="btn btn-outline-primary mt-3 w-50"
                >
                  Buy For{" "}
                  {window.web3.utils.fromWei(
                    this.props.arts.price.toString(),
                    "Ether"
                  )}{" "}
                  Ξ
                </button>
                <p className="mt-2">Currently not for sale!</p>
              </>
            )
          ) : null}
        </div>
      </div>
    );
  }
}

export default DigiArtNFTDetails;
