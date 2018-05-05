pragma solidity ^0.4.21;

import "zeppelin-solidity/contracts/token/ERC20/StandardToken.sol";

/**
 * @title MineFIL Token
 * @dev ERC20 MineFIL Token (MFIL)s
 *
 * All initial MFILs are assigned to the creator of
 * this contract.
 *
 */
contract MineFILToken is StandardToken {

  string public constant name = "MineFIL Token";                            // Set the token name for display
  string public constant symbol = "MFIL";                                   // Set the token symbol for display
  uint8 public constant decimals = 18;                                       // Set the number of decimals for display
  uint256 public constant INITIAL_SUPPLY = 1e10 * 10**uint256(decimals);     // 100 million billion MFIL

  /**
  * @dev MineFILToken Constructor
  * Runs only on initial contract creation.
  */
  function MineFILToken() public {
    totalSupply_ = INITIAL_SUPPLY;                                          // Set the total supply
    balances[msg.sender] = INITIAL_SUPPLY;                                  // Tnitial tokens are assigned to creator
    Transfer(0x0, msg.sender, INITIAL_SUPPLY);                              // emit Transfer event
  }
}