
pragma solidity ^0.4.11;

contract Protection {

	/**
	 * @dev Protection against short address attack
	 */
	modifier onlyPayloadSize(uint numwords) {
	    assert(msg.data.length == numwords * 32 + 4);
	    _;
	}
}
