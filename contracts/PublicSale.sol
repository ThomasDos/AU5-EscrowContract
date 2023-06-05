// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract PublicSale {
    address public owner;
    uint public price;
    string public description;
    bool public isSold;

    constructor(uint _price, string memory _description)  {
        owner = msg.sender;
        price = _price;
        description = _description;
    }

    event PurchaseConfirmed();
    event PriceUpdated(uint _price);
    event ItemDescriptionUpdated(string _description);
    event OwnershipTransferred(address _newOwner);
    event IsSoldUpdated(bool _isSold);

    modifier onlyOwner() {
        require(msg.sender == owner, "Ownable: caller is not the owner");
        _;
    }

    function buy() external payable {
        require(msg.value == price, "Wrong price");
        require(!isSold, "Item is already sold");
        (bool sent, ) = payable(owner).call{value: price}("");
        require(sent, "Failed to send Ether");
        owner = msg.sender;
        isSold = true;
        emit PurchaseConfirmed();
    }

    function updatePrice(uint _price) external onlyOwner {
        price = _price;
        emit PriceUpdated(_price);
    }

    function updateDescription(string memory _description) external onlyOwner {
        description = _description;
        emit ItemDescriptionUpdated(_description);
    }

    function transferOwnership(address _newOwner) external onlyOwner {
        owner = _newOwner;
        emit OwnershipTransferred(_newOwner);
    }

    function updateIsSold(bool _isSold) external onlyOwner {
        isSold = _isSold;
        emit IsSoldUpdated(_isSold);
    }

    function getBalance() public view returns(uint) {
        return address(this).balance;
    }
    
}