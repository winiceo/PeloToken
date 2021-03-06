
pragma solidity ^0.4.23;

contract SampleRecipientSuccess {
    /* @dev A Generic receiving function for contracts that accept tokens */
    address public from;
    uint256 public value;
    address public tokenContract;
    bytes public extraData;

    event ReceivedApproval(uint256 _value);

    function receiveApproval(address _from, uint256 _value, address _tokenContract, bytes _extraData)  public {
        from = _from;
        value = _value;
        tokenContract = _tokenContract;
        extraData = _extraData;
        emit ReceivedApproval(_value);
    }
}
