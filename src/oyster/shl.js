import Web3 from 'web3';
import { comm_u2f, eth } from 'ledgerco';
import ABI from './shl.json';
// import ABITEST from './abiTEST.json';

const Tx = require('ethereumjs-tx');

// const web3 = new Web3(new Web3.providers.HttpProvider('https://api.myetherapi.com/eth'));
const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/MldaSaQTIYCEHoOy7EHM'));
// const web3 = new Web3(new Web3.providers.HttpProvider('http://151.80.44.69:8545'));
// const contractAddress = '0x1844b21593262668b7248d0f57a220caaba46ab9'; // Oyster
const contractAddress = '0x8542325b72c6d9fc0ad2ca965a78435413a915a0'; // SHL
const oysterContract = new web3.eth.Contract(ABI, contractAddress);

/*
get PRL balance of address as string.
*/
const getBalance = async (address) => {
  const balanceRaw = await web3.eth.call({
    to: contractAddress,
    data: oysterContract.methods.balanceOf(address).encodeABI(),
  });

  return web3.utils.fromWei(web3.utils.toBN(balanceRaw).toString(), 'ether');
};
/*
Returns object {from: [], to: []} with old PRL Transactions.
*/
const getTransactions = async (address) => {
  // get transactions to address
  const transactionsTo = oysterContract.getPastEvents('Transfer', {
    filter: { _to: address },
    fromBlock: 4500000,
    toBlock: 5000000,
  });

  // get transactions from address
  const transactionsFrom = oysterContract.getPastEvents('Transfer', {
    filter: { _from: address },
    fromBlock: 4500000,
    toBlock: 5000000,
  });
  // resolve both Promises in parallel
  const result = await Promise.all([transactionsFrom, transactionsTo]);
  // return as object
  return { from: result[0].reverse(), to: result[1].reverse() };
};

const getPrice = () =>
  new Promise((resolve, reject) => {
    fetch('https://api.coinmarketcap.com/v1/ticker/oyster/').then((response) => {
      if (response.status >= 400) {
        reject(Error('Bad response from server'));
      }

      resolve(response.json());
    });
  });

const claim = async () => {
  const payout = '0xB08Db481402fFC547395ea1dd20Db44e2802b57F';
  const fee = '0xb33ee8F7656b77A37131Dd3bcB8D82c1A5D5B5df';
  const from = '0x13099DbF2777c39A1C2B86D02A04C197D57f278a';

  const transactionCount = await web3.eth.getTransactionCount(from);

  const preRawTransaction = {
    from,
    nonce: `0x${transactionCount.toString(16)}`,
    gasPrice: 0,
    gasLimit: 0,
    to: contractAddress,
    value: 0,
    data: oysterContract.methods.claim(payout, fee).encodeABI(),
    chainId: 0x01,
  };

  const gasEstimation = await web3.eth.estimateGas(preRawTransaction);

  const gasPrice = await web3.eth.getGasPrice();

  const rawTransaction = {
    ...preRawTransaction,
    gasLimit: web3.utils.toHex(gasEstimation),
    gasPrice: web3.utils.toHex(gasPrice),
    // gasPrice: web3.utils.toHex(20000000000),
  };

  const tx = new Tx(rawTransaction);

  tx.raw[6] = Buffer.from([1]); // v
  tx.raw[7] = Buffer.from([]); // r
  tx.raw[8] = Buffer.from([]); // s
  const HexTx = tx.serialize().toString('hex');
  console.log(tx);
  const ledgerComm = await comm_u2f.create_async();
  const ETH = new eth(ledgerComm);
  const signedTransaction = await ETH.signTransaction_async("44'/60'/0'/2", HexTx);
  tx.v = Buffer.from(signedTransaction.v, 'hex');
  tx.r = Buffer.from(signedTransaction.r, 'hex');
  tx.s = Buffer.from(signedTransaction.s, 'hex');

  return web3.eth.sendSignedTransaction(`0x${tx.serialize().toString('hex')}`);
};

const lock = async (duration) => {
  const from = '0x13099DbF2777c39A1C2B86D02A04C197D57f278a';
  const transactionCount = await web3.eth.getTransactionCount(from);

  const preRawTransaction = {
    from,
    nonce: `0x${transactionCount.toString(16)}`,
    gasPrice: 0,
    gasLimit: 0,
    to: contractAddress,
    value: 0,
    data: oysterContract.methods.lock(300).encodeABI(),
    chainId: 0x01,
  };

  const gasEstimation = await web3.eth.estimateGas(preRawTransaction);

  const gasPrice = await web3.eth.getGasPrice();

  const rawTransaction = {
    ...preRawTransaction,
    gasLimit: web3.utils.toHex(gasEstimation),
    gasPrice: web3.utils.toHex(gasPrice),

  };

  const tx = new Tx(rawTransaction);

  tx.raw[6] = Buffer.from([1]); // v
  tx.raw[7] = Buffer.from([]); // r
  tx.raw[8] = Buffer.from([]); // s
  const HexTx = tx.serialize().toString('hex');
  console.log(tx);
  const ledgerComm = await comm_u2f.create_async();
  const ETH = new eth(ledgerComm);
  const signedTransaction = await ETH.signTransaction_async("44'/60'/0'/2", HexTx);
  tx.v = Buffer.from(signedTransaction.v, 'hex');
  tx.r = Buffer.from(signedTransaction.r, 'hex');
  tx.s = Buffer.from(signedTransaction.s, 'hex');

  return web3.eth.sendSignedTransaction(`0x${tx.serialize().toString('hex')}`);
};

const getPriceEth = () =>
  new Promise((resolve, reject) => {
    fetch('https://api.coinmarketcap.com/v1/ticker/ethereum/').then((response) => {
      if (response.status >= 400) {
        reject(Error('Bad response from server'));
      }

      resolve(response.json());
    });
  });

// Signing and sending working, gotta finish up and create a clear process through the payment
// CRITICAL

const prepareTx = async (from, recipient, amount) => {
  const transactionCount = await web3.eth.getTransactionCount(from);

  const preRawTransaction = {
    from,
    nonce: `0x${transactionCount.toString(16)}`,
    gasPrice: 0,
    gasLimit: 0,
    to: contractAddress,
    value: 0,
    data: oysterContract.methods.transfer(recipient, amount).encodeABI(),
    chainId: 0x01,
  };

  const gasEstimation = await web3.eth.estimateGas(preRawTransaction);
  const gasPrice = await web3.eth.getGasPrice();
  console.log('Gas Price: ', gasPrice);
  const ethFee = web3.utils.fromWei(web3.utils.toBN(gasPrice * gasEstimation).toString(), 'ether');
  return ethFee;
};

const signTx = async (from, to, amount) => {
  // get TransactionCount
  const transactionCount = await web3.eth.getTransactionCount(from);

  const preRawTransaction = {
    from,
    nonce: `0x${transactionCount.toString(16)}`,
    gasPrice: 0,
    gasLimit: 0,
    to: contractAddress,
    value: 0,
    data: oysterContract.methods.transfer(to, amount * 1000000000000000000).encodeABI(),
    chainId: 0x01,
  };

  const gasEstimation = await web3.eth.estimateGas(preRawTransaction);

  const gasPrice = await web3.eth.getGasPrice();

  const rawTransaction = {
    ...preRawTransaction,
    gasLimit: web3.utils.toHex(gasEstimation),
    gasPrice: web3.utils.toHex(gasPrice),
    // gasPrice: web3.utils.toHex(20000000000),
  };

  const tx = new Tx(rawTransaction);

  tx.raw[6] = Buffer.from([1]); // v
  tx.raw[7] = Buffer.from([]); // r
  tx.raw[8] = Buffer.from([]); // s
  const HexTx = tx.serialize().toString('hex');
  console.log(tx);
  const ledgerComm = await comm_u2f.create_async();
  const ETH = new eth(ledgerComm);
  const signedTransaction = await ETH.signTransaction_async("44'/60'/0'/0", HexTx);
  tx.v = Buffer.from(signedTransaction.v, 'hex');
  tx.r = Buffer.from(signedTransaction.r, 'hex');
  tx.s = Buffer.from(signedTransaction.s, 'hex');

  return tx.serialize();
};

const sendTx = async (tx) => {
  console.log('Sending TX!?');
  return web3.eth.sendSignedTransaction(`0x${tx.toString('hex')}`);
};

export default {
  getBalance,
  getPrice,
  signTx,
  prepareTx,
  sendTx,
  getTransactions,
  getPriceEth,
  lock,
  claim,
};
