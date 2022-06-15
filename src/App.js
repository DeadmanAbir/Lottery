import {
  useMoralis,
  useMoralisWeb3Api,
  useMoralisWeb3ApiCall,
} from "react-moralis";
import swal from "sweetalert";
import React, { useEffect } from "react";
import abi from "./abi.json";

function App() {
  const [par, setPar] = React.useState(0);
  const [bal, setBal] = React.useState(0);
  const [min, setMin] = React.useState(0);
  const [status, setStatus] = React.useState(false);
  const {
    authenticate,
    isAuthenticated,
    user,
    account,
    logout,
    isWeb3Enabled,
    enableWeb3,
    isInitialized,
  } = useMoralis();
  const { Moralis } = useMoralis();
  const { native } = useMoralisWeb3Api();
  const { fetch } = useMoralisWeb3ApiCall(native.runContractFunction);

  useEffect(() => {
    if (!isWeb3Enabled && isAuthenticated) enableWeb3();
  }, [isWeb3Enabled, isAuthenticated]);

  async function login() {
    if (!isAuthenticated) {
      await authenticate();
    }
  }

  async function exit() {
    await logout();
  }

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      lotteryStatus();
      minContribution();
    }
  }, [isAuthenticated, isInitialized]);

  async function enterLottery() {
    // Write Function
    const sendOptions = {
      contractAddress: "0x8d61466b42308fc259E875Fe71Fe173555F8731A",
      functionName: "enterLottery",
      abi,
      msgValue: await Moralis.Units.ETH(prompt("Enter the amount in ETH:")),
    };

    const transaction = await Moralis.executeFunction(sendOptions);
  }

  async function minContribution() {
    //Read Function
    let result = await fetch({
      params: {
        chain: "ropsten",
        address: "0x8d61466b42308fc259E875Fe71Fe173555F8731A",
        function_name: "getminContribution",
        abi,
      },
    });
    // console.log("RESULT FROM " + result);
    setMin(Moralis.Units.FromWei(result));
  }

  async function pickWinner() {
    //Write Function
    const sendOptions = {
      contractAddress: "0x8d61466b42308fc259E875Fe71Fe173555F8731A",
      functionName: "pickWinner",
      abi,
    };
    const transaction = await Moralis.executeFunction(sendOptions);
    setStatus(false);
  }

  async function getBalance() {
    // Read Function

    let result = await fetch({
      params: {
        chain: "ropsten",
        address: "0x8d61466b42308fc259E875Fe71Fe173555F8731A",
        function_name: "getBalance",
        abi,
      },
    });
    console.log("BALANCE FROM " + result);
    setBal(Moralis.Units.FromWei(result));
  }

  async function getParticipants() {
    // Read Function
    let result = await fetch({
      params: {
        chain: "ropsten",
        address: "0x8d61466b42308fc259E875Fe71Fe173555F8731A",
        function_name: "getParticipants",
        abi,
      },
    });
    // console.log("PARTICIPANTS FROM " + result);

    swal({
      title: `Participants: ${Moralis.Units.FromWei(result, 0)}`,
      icon: "info",
    });
  }

  async function showInfo(){
    let result = await fetch({
      params: {
        chain: "ropsten",
        address: "0x8d61466b42308fc259E875Fe71Fe173555F8731A",
        function_name: "getParticipants",
        abi,
      },
    });

    let bal = await fetch({
      params: {
        chain: "ropsten",
        address: "0x8d61466b42308fc259E875Fe71Fe173555F8731A",
        function_name: "getBalance",
        abi,
      },
    });

    swal({
      title: `Participants: ${Moralis.Units.FromWei(result, 0)}`,
      text: `Balance: ${Moralis.Units.FromWei(bal)} ETH`,
      icon: "info",
    });
  }

  async function startLottery() {
    // Write Function
    const sendOptions = {
      contractAddress: "0x8d61466b42308fc259E875Fe71Fe173555F8731A",
      functionName: "startLottery",
      abi,
    };
    const transaction = await Moralis.executeFunction(sendOptions);
    setStatus(true);
  }

  async function lotteryStatus() {
    // Read Function
    let result = await fetch({
      params: {
        chain: "ropsten",
        address: "0x8d61466b42308fc259E875Fe71Fe173555F8731A",
        function_name: "isOpen",
        abi,
      },
    });
    // console.log("LOTTERY STATUS " + result);

    setStatus(result);
  }

  return (
    <>
      <div className="card text-center bg2">
        <div className="card-body bg2">
          {/* {isAuthenticated? <button type="button" className="btn btn-outline-warning" onClick={Update}>Balance: {balances}</button> : null} */}
          {isAuthenticated ? (
            <p className="lottery">Lottery : {status ? "Running" : "Closed"}</p>
          ) : (
            <p className="lottery">Lottery</p>
          )}
          {isAuthenticated ? (
            <p className=" text-gradient">Account : {user.get("ethAddress")}</p>
          ) : (
            <p className=" text-gradient">Account : Not Connected</p>
          )}
          {isAuthenticated ? <p className=" text-gradient">{null}</p> : null}
          {isAuthenticated ? (
            <p className="min">Minimum Contribution : {min} ETH</p>
          ) : null}
          {isAuthenticated ? (
            <button className="button-custom" onClick={showInfo}>
              INFO
            </button>
          ) : null}
          &nbsp; &nbsp;
          {!isAuthenticated ? (
            <button
              type="button"
              className="btn btn-outline-light button-85"
              onClick={login}
            >
              Connect to metamask
            </button>
          ) : null}
          &nbsp;
          {isAuthenticated ? (
            <button type="button" className="button-33" onClick={enterLottery}>
              Enter Lottery
            </button>
          ) : null}
          &nbsp;
          {isAuthenticated &&
          user.get("ethAddress") ===
            "0x846A519f8c6ceF4db5ABa30Fc3c36BE38DA48F06".toLowerCase() ? (
            <button
              type="button"
              className="btn btn-outline-success"
              onClick={startLottery}
            >
              Start Lottery
            </button>
          ) : null}
          &nbsp;
          {isAuthenticated &&
          user.get("ethAddress") ===
            "0x846A519f8c6ceF4db5ABa30Fc3c36BE38DA48F06".toLowerCase() ? (
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={pickWinner}
            >
              Pick Winner
            </button>
          ) : null}
          &nbsp; &nbsp;
          {isAuthenticated ? (
            <button type="button" className="button-78" onClick={exit}>
              Logout
            </button>
          ) : null}
        </div>
        <div className="card-footer text-gradient">Copyright @Abir Dutta</div>
      </div>
    </>
  );
}

export default App;