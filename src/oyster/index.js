import Web3 from 'web3';
import { comm_u2f, eth } from 'ledgerco';
import ABI from './abi.json';
// import ABITEST from './abiTEST.json';

const Tx = require('ethereumjs-tx');

// const web3 = new Web3(new Web3.providers.HttpProvider('https://api.myetherapi.com/eth'));
const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/MldaSaQTIYCEHoOy7EHM'));
const contractAddress = '0x1844b21593262668b7248d0f57a220caaba46ab9'; // Oyster
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
    fromBlock: 0,
    toBlock: 'latest',
  });

  // get transactions from address
  const transactionsFrom = oysterContract.getPastEvents('Transfer', {
    filter: { _from: address },
    fromBlock: 0,
    toBlock: 'latest',
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

// Signing and sending working, gotta finish up and create a clear process through the payment
// CRITICAL
const sendPRL = (from, to, amount, gas) =>
  new Promise((resolve, reject) => {
    web3.eth.getTransactionCount(from).then((count) => {
      const rawTransaction = {
        from,
        nonce: `0x${count.toString(16)}`,
        gasPrice: 3000000000,
        gasLimit: 90000,
        to: contractAddress,
        value: 0,
        data: oysterContract.methods.transfer(to, amount * 1000000000000000000).encodeABI(),
        chainId: 0x01,
      };
      console.log(`Sending from: ${rawTransaction.from}`);

      const tx = new Tx(rawTransaction);

      tx.raw[6] = Buffer.from([1]); // v
      tx.raw[7] = Buffer.from([]); // r
      tx.raw[8] = Buffer.from([]); // s
      const hex_tx = tx.serialize().toString('hex');
      console.log(tx);
      comm_u2f.create_async().then((comm) => {
        const ETH = new eth(comm);
        ETH.signTransaction_async("44'/60'/0'/0", hex_tx).then((result) => {
          tx.v = Buffer.from(result.v, 'hex');
          tx.r = Buffer.from(result.r, 'hex');
          tx.s = Buffer.from(result.s, 'hex');

          const serializedTx = tx.serialize();
          console.log(tx);
          web3.eth.sendSignedTransaction(`0x${serializedTx.toString('hex')}`).then((receipt) => {
            console.log(`Receipt info:  ${JSON.stringify(receipt, null, '\t')}`);
          });
        });
      });
    });
  });
export default {
  getBalance,
  getPrice,
  sendPRL,
  getTransactions,
};
