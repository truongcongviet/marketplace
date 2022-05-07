
/* pages/index.js */
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import Swal from 'sweetalert2'
import NFTMarketplace from '../artifacts/contracts/NFTMarket.sol/NFTMarketplace.json'

import {
  marketplaceAddress
} from '../config'

export default function Home() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const [alert,setAlert] = useState(null);
  const hideAlert = () => {
    setAlert(null);
  }
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.JsonRpcProvider()
    const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, provider)
    const data = await contract.fetchMarketItems()

    /*
    *  map over items returned from smart contract and format 
    *  them as well as fetch their token metadata
    */
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await contract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }
      return item
    }))
    setNfts(items)
    setLoadingState('loaded') 
  }
  async function buyNft(nft) {

    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)

    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];

    /* get all eth in wallet metamask */
    const totalBalance = await provider.getBalance(account)
    
    if(Number(totalBalance.toString())/10**18 > Number(nft.price)){
      const transaction = await contract.createMarketSale(nft.tokenId, {
        value: price
      })
      await transaction.wait()
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Your account not enough ETH to buy NFT',
        confirmButtonText: 'Quit',
        showCloseButton: true
      })
    }
    /* user will be prompted to pay the asking proces to complete the transaction */
    
    loadNFTs()
  }
  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>)
  return (
    <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: '1600px' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <img src={nft.image} />
                <div className="p-4">
                  <p style={{ height: '64px' }} className="text-2xl font-semibold">{nft.name}</p>
                  <div style={{ height: '70px', overflow: 'hidden' }}>
                    <p className="text-gray-400">{nft.description}</p>
                  </div>
                </div>
                <div className="p-4 bg-gray-400">
                  <p className="text-2xl font-bold text-black flex">{nft.price} <img src="./ether.png" className="w-4 ml-2"/></p>
                  
                  <button className="mt-4 w-full bg-purple-300 text-black font-bold py-2 px-12 rounded" onClick={() => buyNft(nft)}>Buy</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}