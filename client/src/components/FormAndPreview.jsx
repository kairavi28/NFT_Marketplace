import React, { Component } from "react";
import DigiArtImage from "./DigiArtImage";

class FormAndPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userSelectedColors: [
        {
          cardBorderColor: "",
          cardBackgroundColor: "",
          headBorderColor: "",
          headBackgroundColor: "",
          leftEyeBorderColor: "",
          rightEyeBorderColor: "",
          leftEyeBackgroundColor: "",
          rightEyeBackgroundColor: "",
          leftPupilBackgroundColor: "",
          rightPupilBackgroundColor: "",
          mouthColor: "",
          neckBackgroundColor: "",
          neckBorderColor: "",
          bodyBackgroundColor: "",
          bodyBorderColor: "",
        },
      ],
      tokenName: "",
      tokenPrice: "",
    };
  }

  componentDidMount = async () => {
    await this.props.setMintBtnTimer();
  };

  callMintMyNFTFromApp = (e) => {
    e.preventDefault();
    this.props.mintMyNFT(
      this.state.userSelectedColors[0],
      this.state.tokenName,
      this.state.tokenPrice
    );
  };

  render() {
    return (
      <div>
        <div className="card mt-1">
          <div className="card-body align-items-center d-flex justify-content-center">
            <h5>Create your own Art!</h5>
          </div>
        </div>
        <form onSubmit={this.callMintMyNFTFromApp} className="pt-4 mt-1">
          <div className="row">
            <div className="col-md-3">
              <div className="form-group">
                <label htmlFor="cardBorderColor">Card Border Color</label>
                <input
                  required
                  type="color"
                  name="cardBorderColor"
                  id="cardBorderColor"
                  value={this.state.userSelectedColors[0].cardBorderColor}
                  className="form-control"
                  onChange={(e) =>
                    this.setState({
                      userSelectedColors: [
                        {
                          ...this.state.userSelectedColors[0],
                          cardBorderColor: e.target.value,
                        },
                      ],
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="cardBackgroundColor">
                  Card Background Color
                </label>
                <input
                  required
                  type="color"
                  name="cardBackgroundColor"
                  id="cardBackgroundColor"
                  value={this.state.userSelectedColors[0].cardBackgroundColor}
                  className="form-control"
                  onChange={(e) =>
                    this.setState({
                      userSelectedColors: [
                        {
                          ...this.state.userSelectedColors[0],
                          cardBackgroundColor: e.target.value,
                        },
                      ],
                    })
                  }
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label htmlFor="rightEyeBorderColor">
                  Right Eye Border Color
                </label>
                <input
                  required
                  type="color"
                  name="rightEyeBorderColor"
                  id="rightEyeBorderColor"
                  value={this.state.userSelectedColors[0].rightEyeBorderColor}
                  className="form-control"
                  onChange={(e) =>
                    this.setState({
                      userSelectedColors: [
                        {
                          ...this.state.userSelectedColors[0],
                          rightEyeBorderColor: e.target.value,
                        },
                      ],
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="leftEyeBackgroundColor">
                  Left Eye Background Color
                </label>
                <input
                  required
                  type="color"
                  name="leftEyeBackgroundColor"
                  id="leftEyeBackgroundColor"
                  value={
                    this.state.userSelectedColors[0].leftEyeBackgroundColor
                  }
                  className="form-control"
                  onChange={(e) =>
                    this.setState({
                      userSelectedColors: [
                        {
                          ...this.state.userSelectedColors[0],
                          leftEyeBackgroundColor: e.target.value,
                        },
                      ],
                    })
                  }
                />
              </div>
            </div>
            <div className="col-md-6 d-flex justify-content-center align-items-center">
              <DigiArtImage colors={this.state.userSelectedColors[0]} />
            </div>
          </div>
          <div className="row">
            <div className="col-md-3">
            </div>
            
            <div className="col-md-10">
              <div className="form-group">
                <label htmlFor="tokenName">Name</label>
                <input
                  required
                  type="text"
                  value={this.state.tokenName}
                  className="form-control"
                  placeholder="Please Enter Author Name/Token Name"
                  onChange={(e) =>
                    this.setState({ tokenName: e.target.value })
                  }
                />
              </div>
              <div>
                <label htmlFor="price">Price</label>
                <input
                  required
                  type="number"
                  name="price"
                  id="tokenPrice"
                  value={this.state.tokenPrice}
                  className="form-control"
                  placeholder="Enter Price In Ξ"
                  onChange={(e) =>
                    this.setState({ tokenPrice: e.target.value })
                  }
                />
              </div>
              <button
                id="mintBtn"
                style={{ fontSize: "0.9rem", letterSpacing: "0.14rem" }}
                type="submit"
                className="btn mt-4 btn-block btn-outline-primary"
              >Mint My Art</button>
              <div className="mt-4">
                {this.props.nameIsUsed ? (
                  <div className="alert alert-danger alert-dissmissible">
                    <button
                      type="button"
                      className="close"
                      data-dismiss="alert"
                    >
                      <span>&times;</span>
                    </button>
                    <strong>This name is taken!</strong>
                  </div>
                ) : this.props.colorIsUsed ? (
                  <>
                    <div className="alert alert-danger alert-dissmissible">
                      <button
                        type="button"
                        className="close"
                        data-dismiss="alert"
                      >
                        <span>&times;</span>
                      </button>
                      {this.props.colorsUsed.length > 1 ? (
                        <strong>These colors are taken!</strong>
                      ) : (
                        <strong>This color is taken!</strong>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        marginTop: "1rem",
                        marginBottom: "3rem",
                      }}
                    >
                      {this.props.colorsUsed.map((color, index) => (
                        <div
                          key={index}
                          style={{
                            background: `${color}`,
                            width: "50%",
                            height: "50px",
                          }}
                        ></div>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default FormAndPreview;
