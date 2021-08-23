import React, { useState, useEffect } from "react";
import DigiArtImage from "./DigiArtImage";
import DigiArtNFTDetails from "./DigiArtNFTDetails";
import Loading from "./Loading";

const AllArt = ({
  accountAddress,
  digiarts,
  totalTokensMinted,
  changeTokenPrice,
  toggleForSale,
  buyToken,
}) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (digiarts.length !== 0) {
      if (digiarts[0].metaData !== undefined) {
        setLoading(loading);
      } else {
        setLoading(false);
      }
    }
  }, [digiarts]);

  return (
    <div>
      <div className="card mt-1">
        <div className="card-body align-items-center d-flex justify-content-center">
          <h5>
            Total No. of Token's Minted On The Platform :{" "}
            {totalTokensMinted}
          </h5>
        </div>
      </div>
      <div className="d-flex flex-wrap mb-2">
        {digiarts.map((arts) => {
          return (
            <div
              key={arts.tokenId.toNumber()}
              className="w-50 p-4 mt-1 border"
            >
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
              <DigiArtNFTDetails
                arts={arts}
                accountAddress={accountAddress}
                changeTokenPrice={changeTokenPrice}
                toggleForSale={toggleForSale}
                buyToken={buyToken}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllArt;
