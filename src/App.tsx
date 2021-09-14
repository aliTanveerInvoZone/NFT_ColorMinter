/* eslint-disable react-hooks/exhaustive-deps */
import "../shim";
import Web3 from "web3";
import "../shim";
import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { Header } from "./Components/header";
// import { Main } from "./Components/Main";
import { Loader } from "./Components/loader";
import HDWalletProvider from "@truffle/hdwallet-provider";
import { PRIVATE_KEYS, PROVIDER } from "./constants";
import ColorABI from "./abis/Color.json";

import { ColorPickerModal } from "./Components/ColorPicker";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
  const [colors, setColors] = useState([]);
  const [loader, setLoader] = useState(false);
  const [colorPickerModal, showColorPicker] = useState(false);

  var hdWalletProvider = new HDWalletProvider({
    privateKeys: PRIVATE_KEYS,
    providerOrUrl: PROVIDER,
    numberOfAddresses: 1,
  });
  var web3 = new Web3(hdWalletProvider);
  useEffect(() => {
    setLoader(true);
    const init = async () => {
      await loadBlockChainData();
    };
    init();
  }, []);

  async function loadBlockChainData() {
    console.log("Load Block Data ===> "); // Init Web3 Block Chain
    let accounts = await web3.eth.getAccounts();
    console.log("Accounts Address ====> ", accounts);
    let balance = await web3.eth.getBalance(accounts[0]);
    console.log("balance === > ", balance);

    setAccount(accounts[0]);
    const networkID = await web3.eth.net.getId();
    const networkData = ColorABI.networks[networkID];
    if (networkData) {
      const ABI = ColorABI.abi;
      const address = networkData.address;
      const contract = new web3.eth.Contract(ABI, address);
      console.log("Contracts ====> ", contract);
      setContract(contract);

      const totalSupply = await contract.methods.totalSupply().call();
      console.log("totalSupply ====> ", totalSupply);
      setTotalSupply(totalSupply);
      if (totalSupply) {
        let colors = [];
        for (var i = 1; i <= totalSupply; i++) {
          const color = await contract.methods.colors(i - 1).call();
          console.log("color", color);
          colors.push(color);
        }
        setColors(colors);
      }
    } else {
      alert("Smart Contract is not Deployed to Network");
    }
    setLoader(false);
  }

  function mint(color: string) {
    setLoader(true);
    contract.methods
      .mint(color)
      .send({ from: account, gas: 3000000 })
      .on("receipt", (receipt: any) => {
        console.log("Receipt====>", receipt);
      })
      .on("confirmation", async (confirmation: any) => {
        console.log("Confirmation--->", confirmation);
        if (confirmation === 0) {
          setLoader(false);
          await loadBlockChainData();
          return;
        }
      });
  }

  return (
    <SafeAreaView style={{ flex: 1, alignItems: "center" }}>
      <Header title={"NFT's"} accountAddress={account} />

      <Loader isLoading={loader} />

      <View style={{ width: "100%", height: "100%", alignItems: "center" }}>
        <ColorPickerModal
          visible={colorPickerModal}
          selectedColor={(color) => {
            showColorPicker(false);
            mint(color);
          }}
        />

        <TouchableOpacity
          onPress={() => {
            showColorPicker(true);
          }}
          style={{
            width: "50%",
            height: 50,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
            backgroundColor: "black",
            marginTop: 20,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>{"Mint Colors"}</Text>
        </TouchableOpacity>

        <FlatList
          data={colors}
          numColumns={3}
          renderItem={(item) => {
            console.log("item", item);
            return (
              <View style={{ height: 120, width: 120, margin: 5, justifyContent: "center", alignItems: "center" }}>
                <View style={{ width: 100, height: 100, borderRadius: 100, backgroundColor: item.item, padding: 10 }} />
                <Text style={{ fontWeight: "bold" }}>{item.item}</Text>
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}

export default App;
