
pragma solidity ^0.4.11;

import './Protection.sol';
import './TokenRecipient.sol';
import 'zeppelin-solidity/contracts/token/ERC20/PausableToken.sol';

contract PELOToken is Protection, PausableToken {

	string public name = "Peloponnesian";
	string public symbol = "PELO";
	uint256 public decimals = 18;

	string public version = '0.0.2';

	/**
	 * @dev Cap for minted tokens.
	 */
	uint256 public cap;

	/**
	 * @dev Logged when claimed tokens were transferred to the owner.
	 *
	 * @param _to address of the owner, tokens were transferred to
	 * @param _value number of tokens transferred
	 */
	event ClaimTransfer (address indexed _to, uint256 _value);

	/**
     * @dev Transfer with short address attack protection
     */
	function transfer(address _to, uint _value) onlyPayloadSize(2) returns (bool) {
    	return super.transfer(_to, _value);
  	}

	/**
     * @dev TransferFrom with short address attack protection
     */
	function transferFrom(address _from, address _to, uint _value) onlyPayloadSize(3) returns (bool) {
		return super.transferFrom(_from, _to, _value);
	}

	/**
     * @dev Allowance with short address attack protection
     */
	function allowance(address _owner, address _spender) onlyPayloadSize(2) constant returns (uint256 remaining) {
    	return super.allowance(_owner, _spender);
  	}

	/**
     * @dev Approve and then communicate the approved contract in a single transaction
     */
    function approveAndCall(address _spender, uint256 _value, bytes _extraData) returns (bool success) {
        TokenRecipient spender = TokenRecipient(_spender);
        if (approve(_spender, _value)) {
            spender.receiveApproval(msg.sender, _value, this, _extraData);
            return true;
        }
    }
}
