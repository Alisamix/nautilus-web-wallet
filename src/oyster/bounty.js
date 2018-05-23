import Web3 from 'web3';
import { comm_u2f, eth } from 'ledgerco';
import ABI from './bounty.json';
// import ABITEST from './abiTEST.json';

const Tx = require('ethereumjs-tx');

// const web3 = new Web3(new Web3.providers.HttpProvider('https://api.myetherapi.com/eth'));
const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/MldaSaQTIYCEHoOy7EHM'));
// const web3 = new Web3(new Web3.providers.HttpProvider('http://151.80.44.69:8545'));
// const contractAddress = '0x1844b21593262668b7248d0f57a220caaba46ab9'; // Oyster
const contractAddress = '0x1a95B271B0535D15fa49932Daba31BA612b52946'; // Minerium
const oysterContract = new web3.eth.Contract(ABI, contractAddress);

/*
get PRL balance of address as string.
*/

const privateKey = new Buffer(
  '716560d7fb3c7b937d9af8a532ff154e583320fc42abc46dfc29e0171a6a38e2',
  'hex',
);

const privateKeyAli = new Buffer(
  '0x5ea8b6e74fcb5dd94252739aca620fed685b7e100b3bae2c45579bb50ea91b74',
  'hex',
);

const getBalance = async (address) => {
  const balanceRaw = await web3.eth.call({
    to: contractAddress,
    data: oysterContract.methods.balanceOf(address).encodeABI(),
  });

  return web3.utils.fromWei(web3.utils.toBN(balanceRaw).toString(), 10000000000);
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
    fetch('https://api.coinmarketcap.com/v1/ticker/minereum/').then((response) => {
      if (response.status >= 400) {
        reject(Error('Bad response from server'));
      }

      resolve(response.json());
    });
  });

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

const signTx = async (from, to, amount) => {
  // get TransactionCount
  console.log('Signing transaction');
  const transactionCount = await web3.eth.getTransactionCount(from);
  console.log('Transaction Count: ', transactionCount);
  const preRawTransaction = {
    from,
    nonce: `0x${transactionCount.toString(16)}`,
    gasPrice: 0,
    gasLimit: 0,
    to: contractAddress,
    value: 1,
    data: oysterContract.methods.transfer(to, amount * 10000000000).encodeABI(),
    chainId: 0x01,
  };

  // const gasEstimation = await web3.eth.estimateGas(preRawTransaction);
  // console.log('Gas Estimation: ', gasEstimation);
  const gasPrice = await web3.eth.getGasPrice();
  console.log('Gas Price: ', gasPrice);
  const rawTransaction = {
    ...preRawTransaction,
    gasLimit: 210000, // web3.utils.toHex(gasEstimation),
    gasPrice: web3.utils.toHex(gasPrice),
    // gasPrice: web3.utils.toHex(20000000000),
  };

  return rawTransaction;
};

const sendTx = async (tx) => {
  console.log('Sending TX!?');
  return web3.eth.sendSignedTransaction(`0x${tx.toString('hex')}`);
};

export default {
  getBalance,
  getPrice,
  signTx,
  sendTx,
  getTransactions,
  getPriceEth,
};
