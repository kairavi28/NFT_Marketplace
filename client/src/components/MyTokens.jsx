import React, { useState, useEffect } from "react";
import DigiArtImage from "./DigiArtImage";
import AllNFTDetails from "./AllNFTDetails";
import Loading from "./Loading";

const MyTokens = ({
  accountAddress,
  digiarts,
  totalTokensOwnedByAccount,
}) => {
  const [loading, setLoading] = useState(false);
  const [myToken, setMyTokens] = useState([]);
  useEffect(() => {
    if (digiarts.length !== 0) {
      if (digiarts[0].metaData !== undefined) {
        setLoading(loading);
      } else {
        setLoading(false);
      }
    }
    const myTokens = digiarts.filter(
      (arts) => arts.currentOwner === accountAddress
    );
    setMyTokens(myTokens);
  }, [digiarts]);

  return (
    <div>
      <div className="card mt-1">
        <div className="card-body align-items-center d-flex justify-content-center">
          <h5>
            Total No. of Tokens You Own : {totalTokensOwnedByAccount}
          </h5>
        </div>
      </div>
      <div className="d-flex flex-wrap mb-2">
        {myToken.map((arts) => {
          return (
            <div
              key={arts.tokenId.toNumber()}
              className="w-50 p-4 mt-1 border"
            >
              <div className="row">
                <div className="col-md-6">
                  {!loading ? (
                    <DigiArtImage
                      colors={
                        arts.metaData !== undefined
                          ? arts.metaData.metaData.colors
                          : ""
                      }
                    />
                  ) : (
                    <Loading />
                  )}
                </div>
                <div className="col-md-6 text-center">
                  <AllNFTDetails
                    arts={arts}
                    accountAddress={accountAddress}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyTokens;
