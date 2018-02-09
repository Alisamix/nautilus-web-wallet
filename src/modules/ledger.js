import { comm_u2f, eth } from 'ledgerco';
import Web3 from 'web3';
import Oyster from '../oyster/index';
import _ from 'lodash';

export const CONNECTION_REQUESTED = 'ledger/CONNECTION_REQUESTED';
export const ADDRESS_RETRIEVED = 'ledger/ADDRESS_RETRIEVED';
export const CONNECTION_TIMEOUT = 'ledger/CONNECTION_TIMEOUT';
export const PUSH_ADDRESS = 'ledger/PUSH_ADDRESS';

const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/MldaSaQTIYCEHoOy7EHM'));

const initialState = {
  address: undefined,
  loading: false,
  error: undefined,
  balance: undefined,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADDRESS_RETRIEVED:
      return {
        ...state,
        address: action.payload,
        balance: action.payload.balance,
        loading: false,
        error: null,
      };
    case PUSH_ADDRESS:
      return {
        ...state,
        address: action.payload,
        loading: false,
        error: null,
      };
    case CONNECTION_REQUESTED:
      return {
        ...state,
        loading: true,
        error: null,
        address: undefined,
      };
    case CONNECTION_TIMEOUT:
      return {
        ...state,
        loading: false,
        error: action.payload,
        address: undefined,
      };

    default:
      return state;
  }
};

export const getAddress = amount => (dispatch) => {
  dispatch({ type: CONNECTION_REQUESTED });

  return comm_u2f.create_async().then((comm) => {
    const ETH = new eth(comm);

    const results = _.range(amount).map(number =>
      ETH
        // default path
        .getAddress_async(`44'/60'/0'/${number}`));

    Promise.all(results)
      .then((completed) => {
        console.log(completed);
        dispatch({
          type: PUSH_ADDRESS,
          payload: completed,
        });
      })
      .catch((error) => {
        switch (error) {
          case 'Invalid status 6801':
            dispatch({ type: CONNECTION_TIMEOUT, payload: 'Ledger is locked!' });
            break;
          default:
            dispatch({ type: CONNECTION_TIMEOUT, payload: 'No Ledger found!' });
        }
      });
  });

  // dispatch Timeout
};
