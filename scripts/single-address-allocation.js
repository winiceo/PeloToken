// Dotenv javascript libraries needed
require('dotenv').config();
// Need access to my path and file system
var path = require('path');

var BigNumber = require('bignumber.js');

var fs = require('fs');
// Ethereum javascript libraries needed
var Web3 = require('web3');
var Tx = require('ethereumjs-tx');
// Rather than using a local copy of geth, interact with the ethereum blockchain via infura.io
// The key for infura.io is in .env
const web3 = new Web3(Web3.givenProvider || "https://rinkeby.infura.io/" + process.env["INFURA_KEY"])
// Fixed-point notation for number of MFIL which is divisible to 3 decimal places
function financialMfil(numMfil) {
    return Number.parseFloat(numMfil / 1e3).toFixed(3);
}
// Create an async function so I can use the "await" keyword to wait for things to finish
const main = async () => {
    // This code was written and tested using web3 version 1.0.0-beta.29
    console.log(`web3 version: ${web3.version}`)
    // Who holds the token now?
    var myAddress = "0x9BE6480ce91648ceC902AE50C43Ade9025733347";
    // Who are we trying to send this token to?
    var destAddress = "0xfd21AD27B120151B93f550FCF12942E5EcF8852d";
    // MineFIL Token (MFIL) is divisible to 3 decimal places, 1 = 0.001 of MFIL
    var transferAmount = new BigNumber( 12456*1e18);
    // Determine the nonce
    var count = await web3.eth.getTransactionCount(myAddress);
    console.log(`num transactions so far: ${count}`);
    // MineFILToken contract ABI Array
    var abiArray = JSON.parse(fs.readFileSync(path.resolve(__dirname, './pelo-token-contract-abi.json'), 'utf-8'));
    // The address of the contract which created MFIL
    var contractAddress = "0x4da4ab32d91a5dc856c7ddb01cd5cbb2c3a5525f";
    var contract = new web3.eth.Contract(abiArray, contractAddress, {
        from: myAddress
    });
    // How many tokens do I have before sending?
    var balance = await contract.methods.balanceOf(myAddress).call();
    console.log(`Balance before send: ${financialMfil(balance)} MFIL\n------------------------`);
    // I chose gas price and gas limit based on what ethereum wallet was recommending for a similar transaction. You may need to change the gas price!
    // Use Gwei for the unit of gas price
    var gasPriceGwei = 3;
    var gasLimit = 3000000;
    // Chain ID of Ropsten Test Net is 3, replace it to 1 for Main Net
    var chainId = 4;
    var rawTransaction = {
        "from": myAddress,
        "nonce": "0x" + count.toString(16),
        "gasPrice": web3.utils.toHex(gasPriceGwei * 1e9),
        "gasLimit": web3.utils.toHex(gasLimit),
        "to": contractAddress,
        "value": "0x0",
        "data": contract.methods.transfer(destAddress, transferAmount).encodeABI(),
        "chainId": chainId
    };
    console.log(`Raw of Transaction: \n${JSON.stringify(rawTransaction, null, '\t')}\n------------------------`);

    console.log(process.env["PRIVATE_KEY"])
    // The private key for myAddress in .env
    var privKey = new Buffer(process.env["PRIVATE_KEY"], 'hex');
    var tx = new Tx(rawTransaction);
    tx.sign(privKey);
    var serializedTx = tx.serialize();
    // Comment out these four lines if you don't really want to send the TX right now
    console.log(`Attempting to send signed tx:  ${serializedTx.toString('hex')}\n------------------------`);
    var receipt = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
    // The receipt info of transaction, Uncomment for debug
    console.log(`Receipt info: \n${JSON.stringify(receipt, null, '\t')}\n------------------------`);
    // The balance may not be updated yet, but let's check
    balance = await contract.methods.balanceOf(myAddress).call();
    console.log(`Balance after send: ${financialMfil(balance)} MFIL`);
}
main();
