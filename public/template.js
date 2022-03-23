(function () {
  let web3, eth, abi, address;

  let accountAddress;

  const chainMetadata = {
    id: "0x539",
    name: "Kontour Test Chain: Untitled Project",
    symbol: "ETH",
    decimals: 18,
    rpcUrls: ["localhost:8545"],
    blockExplorerUrls: [],
  };

  const onWeb3Loaded = () => {
    web3 = new window.Web3(window.Web3.givenProvider);
    window.kontour.web3 = web3;
  };

  const onMetamaskLoaded = async () => {
    eth = await detectEthereumProvider();
    window.kontour.eth = eth;
    window.kontour.web3 = web3;
  };

  const init = () => {
    var web3jsScriptEl = document.createElement("script");

    web3jsScriptEl.onload = onWeb3Loaded;
    web3jsScriptEl.src =
      "https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js";

    var metamaskDetectScriptEl = document.createElement("script");

    metamaskDetectScriptEl.onload = onMetamaskLoaded;
    metamaskDetectScriptEl.src =
      "https://unpkg.com/@metamask/detect-provider/dist/detect-provider.min.js";

    document.head.append(metamaskDetectScriptEl, web3jsScriptEl);
  };

  const getAccountAddress = () => {
    return accountAddress;
  };

  const setAccountAddress = (newAccountAddress) => {
    accountAddress = newAccountAddress;
  };

  const switchToProperNode = async () => {
    try {
      kontour?.eth?.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: chainMetadata.id,
            chainName: chainMetadata.name,
            nativeCurrency: {
              name: "Kontour Eth",
              symbol: chainMetadata.symbol,
              decimals: 18,
            },
            rpcUrls: chainMetadata.rpcUrls,
            blockExplorerUrls:
              (chainMetadata.blockExplorerUrls &&
                chainMetadata.blockExplorerUrls.length > 0) ||
              null,
          },
        ],
      });
    } catch (error) {
      if (!(error instanceof Error)) {
        throw `Something went wrong when adding kontour network: ${error}`;
      }
      alert(
        `Error ${
          error.code
        }. Something went wrong while trying to add kontour network: ${
          error && error.message
        }`
      );
    }
    try {
      const r = await eth.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainMetadata.id }],
      });
    } catch (error) {
      if (!(error instanceof Error)) {
        throw `Something went wrong detecting switch errors: ${error}`;
      }
      // This error code indicates that the chain has not been added to MetaMask.
      if (error.code === 4902) {
        try {
          await eth.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: chainMetadata.id,
                chainName: chainMetadata.name,
                nativeCurrency: {
                  symbol: chainMetadata.id,
                  decimals: chainMetadata.name,
                },
                rpcUrls: chainMetadata.rpcUrls,
                blockExplorerUrls: chainMetadata.blockExplorerUrls,
              },
            ],
          });
        } catch (addError) {
          // handle "add" error
          alert(
            `${error.code}. Something went wrong while trying to add network: ${
              error && error.message
            }`
          );
        }
      } else {
        alert(
          `Error ${
            error.code
          }. Something went wrong while trying to switch networks: ${
            error && error.message
          }`
        );
      }
    }
  };

  // are they connected to metamask?
  const fetchMetamaskAccount = async () => {
    if (eth == null) {
      return null;
    }
    const a = await web3.eth.getChainId();
    const accounts = await eth.request({ method: "eth_accounts" });
    if (!(accounts && accounts.length)) {
      // User is not connected to metamask
      return null;
    }
    accountAddress = accounts[0];
    return accountAddress;
  };

  const isMetamaskAvailable = () => eth != null;

  // request metamask accounts. returns true if success, false if not connected
  const requestMetamaskAccounts = async () => {
    // first switch to the proper chain before even connecting
    await switchToProperNode();
    if (eth == null) {
      return null;
    }
    const accounts = await eth.request({
      method: "eth_requestAccounts",
    });

    // User is not connected to metmask
    if (!(accounts && accounts.length)) {
      return null;
    }
    // otherwise we found the current address, let's store it
    accountAddress = accounts[0];
    return accountAddress;
  };

  const send = async (contract, methodName, ...args) => {
    if (accountAddress == null) {
      throw new Error("User has not connected Metamask");
    }

    const transaction = contract.methods[methodName](...args);

    const g = await transaction.estimateGas({ from: accountAddress });
    const result = await transaction
      .send({
        from: accountAddress,
        gas: Math.round(g * 1.25),
      })
      .on("error", function (error, receipt) {
        console.error("error", error);
        throw error;
      });

    return result;
  };

  const sendPayable = async (contract, methodName, value, ...args) => {
    if (accountAddress == null) {
      throw new Error("User has not connected Metamask");
    }

    const transaction = contract.methods[methodName](...args);

    const data = {
      from: accountAddress,
      value: value,
    };
    const g = await transaction.estimateGas(data);
    const result = await transaction
      .send({
        gas: g,
        ...data,
      })
      .on("error", function (error, receipt) {
        throw error;
      });
    return result;
  };

  const call = async (contract, methodName, ...args) => {
    let val = null;

    try {
      val = await contract.methods[methodName](...args).call();
    } catch (e) {
      console.error("error", e);
      throw e;
    }

    return val;
  };

  const onEvent = async (
    eventName,
    { onEventConnected, onEventReceived, onEventRemoved, onError },
    options
  ) => {
    await contract.events[eventName](options)
      .on("connected", (subscriptionId) => {})
      .on("changed", (event) => {
        onEventRemoved(event);
      })
      .on("data", (event) => {
        onEventReceived(event);
      })
      .on("error", (error, receipt) => {
        onError(error, receipt);
      });
  };

  const onEventOnce = async (
    eventName,
    { onEventReceived, onError },
    options
  ) => {
    await contract.once(eventName, options, function (error, event) {
      if (error) {
        onError(error);
      } else {
        onEventReceived(event);
      }
    });
  };

  /* generated */

  /* exports */
  window.kontour = {
    init,
    fetchMetamaskAccount,
    requestMetamaskAccounts,
    send,
    sendPayable,
    call,
    getAccountAddress,
    setAccountAddress,
    isMetamaskAvailable,

    /* escape hatches */
    web3,
    eth,
  };

  init();
})();
