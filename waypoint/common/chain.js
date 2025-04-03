function defineChain(chain) {
  return {
    formatters: undefined,
    fees: undefined,
    serializers: undefined,
    ...chain
  };
}

const goerli = /*#__PURE__*/defineChain({
  id: 5,
  name: 'Goerli',
  nativeCurrency: {
    name: 'Goerli Ether',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.ankr.com/eth_goerli']
    }
  },
  blockExplorers: {
    default: {
      name: 'Etherscan',
      url: 'https://goerli.etherscan.io',
      apiUrl: 'https://api-goerli.etherscan.io/api'
    }
  },
  contracts: {
    ensRegistry: {
      address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
    },
    ensUniversalResolver: {
      address: '0xfc4AC75C46C914aF5892d6d3eFFcebD7917293F1',
      blockCreated: 10_339_206
    },
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 6507670
    }
  },
  testnet: true
});

const mainnet = /*#__PURE__*/defineChain({
  id: 1,
  name: 'Ethereum',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: ['https://cloudflare-eth.com']
    }
  },
  blockExplorers: {
    default: {
      name: 'Etherscan',
      url: 'https://etherscan.io',
      apiUrl: 'https://api.etherscan.io/api'
    }
  },
  contracts: {
    ensRegistry: {
      address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
    },
    ensUniversalResolver: {
      address: '0xce01f8eee7E479C928F8919abD53E553a36CeF67',
      blockCreated: 19_258_213
    },
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 14_353_601
    }
  }
});

const ronin = /*#__PURE__*/defineChain({
  id: 2020,
  name: 'Ronin',
  nativeCurrency: {
    name: 'RON',
    symbol: 'RON',
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: ['https://api.roninchain.com/rpc']
    }
  },
  blockExplorers: {
    default: {
      name: 'Ronin Explorer',
      url: 'https://app.roninchain.com'
    }
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 26023535
    }
  }
});

const saigon = /*#__PURE__*/defineChain({
  id: 2021,
  name: 'Saigon Testnet',
  nativeCurrency: {
    name: 'RON',
    symbol: 'RON',
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: ['https://saigon-testnet.roninchain.com/rpc']
    }
  },
  blockExplorers: {
    default: {
      name: 'Saigon Explorer',
      url: 'https://saigon-app.roninchain.com'
    }
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 18736871
    }
  },
  testnet: true
});

const sepolia = /*#__PURE__*/defineChain({
  id: 11_155_111,
  name: 'Sepolia',
  nativeCurrency: {
    name: 'Sepolia Ether',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: ['https://rpc2.sepolia.org']
    }
  },
  blockExplorers: {
    default: {
      name: 'Etherscan',
      url: 'https://sepolia.etherscan.io',
      apiUrl: 'https://api-sepolia.etherscan.io/api'
    }
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 751532
    },
    ensRegistry: {
      address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
    },
    ensUniversalResolver: {
      address: '0xc8Af999e38273D658BE1b921b88A9Ddf005769cC',
      blockCreated: 5_317_080
    }
  },
  testnet: true
});

const VIEM_CHAIN_MAPPING = {
  [ronin.id]: ronin,
  [saigon.id]: saigon,
  [mainnet.id]: mainnet,
  [goerli.id]: goerli,
  [sepolia.id]: sepolia
};

export { VIEM_CHAIN_MAPPING };
