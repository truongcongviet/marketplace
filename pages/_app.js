/* pages/_app.js */
import '../styles/globals.css'
import Link from 'next/link'
import { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'

export default function MyApp({ Component, pageProps }) {
  const web3Modal = new Web3Modal()
  const connection = await web3Modal.connect()
  const provider = new ethers.providers.Web3Provider(connection)
  const signer = provider.getSigner()

  const connectWallet = () => {
    let transaction = await contract.createToken(url, price, { value: listingPrice })
    await transaction.wait()
  }

  return (
    <div>
      <nav className="border-b p-6 flex justify-between">
        <div>
          <p className="text-4xl font-bold mb-12">NFT Polygon Marketplace</p>
          <div className="flex mt-4">
            <div className="w-[150px] border-2 mr-6 border-purple-300 text-center rounded-lg hover:bg-purple-300 hover:scale-110 hover:shadow-lg">
              <Link href="/" className="w-full">
                <a className="text-black px-12">
                  Home
                </a>
              </Link>
            </div>
            
            <div className="w-[150px] border-2 mr-6 border-purple-300 text-center rounded-lg hover:bg-purple-300 hover:scale-110 hover:shadow-lg">
              <Link href="/create-nft">
                <a className="text-black px-8">
                  Sell NFT
                </a>
              </Link>
            </div>
          
            <div className="w-[150px] border-2 mr-6 border-purple-300 text-center rounded-lg hover:bg-purple-300 hover:scale-110 hover:shadow-lg">
              <Link href="/my-nfts">
                <a className=" text-black px-8">
                  My NFTs
                </a>
              </Link>
            </div>
            
            <div className="w-[150px] border-2 mr-6 border-purple-300 text-center rounded-lg hover:bg-purple-300 hover:scale-110 hover:shadow-lg">
              <Link href="/dashboard">
                <a className="text-black px-10">
                  Dashboard
                </a>
              </Link>
            </div>
            
          </div>
        </div>
        
        <div className="border-2 border-indigo-500/75 rounded-lg max-h-[40px] items-center text-center bg-indigo-600 hover:bg-indigo-800">
          <button className="px-5 py-1.5 font-bold text-white" onClick={connectWallet}>Login</button>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}
