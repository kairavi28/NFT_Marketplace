// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma abicoder v2;

// import ERC721 iterface
import './ERC721.sol';

//DIGI ART CONTRACT
contract DigiArt is ERC721 {

  string public collectionName;
  string public collectionNameSymbol;
  uint256 public artCounter;

   struct ArtPiece {
    uint256 tokenId;
    string tokenName;
    string tokenURI;
    address mintedBy;
    address currentOwner;
    address previousOwner;
    uint256 price;
    uint256 numberOfTransfers;
    bool forSale;
  }

  mapping(uint256 => ArtPiece) public allArtPieces;
  mapping(string => bool) public tokenNameExists;
  mapping(string => bool) public colorExists;
  mapping(string => bool) public tokenURIExists;

  constructor() ERC721("Art Collection", "DA") {
    collectionName = name();
    collectionNameSymbol = symbol();
  }

  function mintNFT(string memory _name, string memory _tokenURI, uint256 _price, string[] calldata _colors) external {
    require(msg.sender != address(0));
    artCounter ++;
    require(!_exists(artCounter));

    for(uint i=0; i<_colors.length; i++) {
      require(!colorExists[_colors[i]]);
    }
    require(!tokenURIExists[_tokenURI]);
    require(!tokenNameExists[_name]);

    _mint(msg.sender, artCounter);
    _setTokenURI(artCounter, _tokenURI);

    for (uint i=0; i<_colors.length; i++) {
      colorExists[_colors[i]] = true;
    }
    tokenURIExists[_tokenURI] = true;
    tokenNameExists[_name] = true;
    ArtPiece memory newToken = ArtPiece(
    artCounter,
    _name,
    _tokenURI,
    msg.sender,
    msg.sender,
    address(0),
    _price,
    0,
    true);
    allArtPieces[artCounter] = newToken;
  }

  function getTokenOwner(uint256 _tokenId) public view returns(address) {
    address _tokenOwner = ownerOf(_tokenId);
    return _tokenOwner;
  }
  
  function getTokenMetaData(uint _tokenId) public view returns(string memory) {
    string memory tokenMetaData = tokenURI(_tokenId);
    return tokenMetaData;
  }

  function getNumberOfTokensMinted() public view returns(uint256) {
    uint256 totalNumberOfTokensMinted = totalSupply();
    return totalNumberOfTokensMinted;
  }

  function getTotalNumberOfTokensOwnedByAnAddress(address _owner) public view returns(uint256) {
    uint256 totalNumberOfTokensOwned = balanceOf(_owner);
    return totalNumberOfTokensOwned;
  }

  function getTokenExists(uint256 _tokenId) public view returns(bool) {
    bool tokenExists = _exists(_tokenId);
    return tokenExists;
  }

  function buyToken(uint256 _tokenId) public payable {
    require(msg.sender != address(0));
    require(_exists(_tokenId));
    address tokenOwner = ownerOf(_tokenId);
    require(tokenOwner != address(0));
    require(tokenOwner != msg.sender);
    ArtPiece memory newToken = allArtPieces[_tokenId];
    require(msg.value >= newToken.price);
    require(newToken.forSale);
    _transfer(tokenOwner, msg.sender, _tokenId);
    address payable sendTo = payable(newToken.currentOwner);
    sendTo.transfer(msg.value);
    newToken.previousOwner = newToken.currentOwner;
    newToken.currentOwner = msg.sender;
    newToken.numberOfTransfers += 1;
    allArtPieces[_tokenId] = newToken;
  }

  function changeTokenPrice(uint256 _tokenId, uint256 _newPrice) public {
    require(msg.sender != address(0));
    require(_exists(_tokenId));
    address tokenOwner = ownerOf(_tokenId); 
    require(tokenOwner == msg.sender);
    ArtPiece memory newToken = allArtPieces[_tokenId];
    newToken.price = _newPrice;
    allArtPieces[_tokenId] = newToken;
  }

  function toggleForSale(uint256 _tokenId) public {
    require(msg.sender != address(0));
    require(_exists(_tokenId));
    address tokenOwner = ownerOf(_tokenId);
    require(tokenOwner == msg.sender);
    ArtPiece memory newToken = allArtPieces[_tokenId];
    if(newToken.forSale) {
      newToken.forSale = false;
    } else {
      newToken.forSale = true;
    }
    allArtPieces[_tokenId] = newToken;
  }
}