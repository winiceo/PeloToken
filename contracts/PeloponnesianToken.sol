pragma solidity ^0.4.23;

import './Protection.sol';
import './TokenRecipient.sol';
import './PausableToken.sol';


contract PeloponnesianToken is Protection,PausableToken {
    string public name = "Peloponnesian";
    string public symbol = "PELO";
    uint256 public decimals = 18;
    uint256 public initialSupply = 100 * 10**8 * uint256(10**decimals);


    constructor( ) public {

        _totalSupply = initialSupply;
        _balanceOf[msg.sender] = initialSupply;

    }


    /**
     * @dev Transfer with short address attack protection
     */
    function transfer(address _to, uint _value) public onlyPayloadSize(2) returns (bool) {
        return super.transfer(_to, _value);
    }

    /**
     * @dev TransferFrom with short address attack protection
     */
    function transferFrom(address _from, address _to, uint _value) public onlyPayloadSize(3) returns (bool) {
        return super.transferFrom(_from, _to, _value);
    }

    /**
     * @dev Allowance with short address attack protection
     */
    function allowance(address _owner, address _spender) public onlyPayloadSize(2) constant returns (uint256 remaining) {
        return super.allowance(_owner, _spender);
    }

    /**
     * @dev Approve and then communicate the approved contract in a single transaction
     */
    function approveAndCall(address _spender, uint256 _value, bytes _extraData) public returns (bool success) {
        TokenRecipient spender = TokenRecipient(_spender);
        if (approve(_spender, _value)) {
            spender.receiveApproval(msg.sender, _value, this, _extraData);
            return true;
        }
    }


}
