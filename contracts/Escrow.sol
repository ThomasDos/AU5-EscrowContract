// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Escrow {
	address public arbiter;
	address public beneficiary;
	address public depositor;

	bool public isApproved;

	constructor(address _arbiter, address _beneficiary) payable {
		require(msg.value > 0, "You must deposit some Ether");
		require(_arbiter != address(0), "Invalid arbiter address");
		require(_beneficiary != address(0), "Invalid beneficiary address");
		require(msg.sender != _arbiter, "Arbiter and depositor cannot be the same");
		arbiter = _arbiter;
		beneficiary = _beneficiary;
		depositor = msg.sender;
	}

	event Approved(uint);

	function approve() external {
		require(msg.sender == arbiter, "You are not the arbiter");
		uint balance = address(this).balance;
		(bool sent, ) = payable(beneficiary).call{value: balance}("");
 		require(sent, "Failed to send Ether");
		emit Approved(balance);
		isApproved = true;
	}
}
