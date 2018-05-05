
pragma solidity ^0.4.11;

contract TokenRecipient {
    /**
     * @dev receive approval
     */
    function receiveApproval(address _from, uint256 _value, address _to, bytes _extraData);
}
