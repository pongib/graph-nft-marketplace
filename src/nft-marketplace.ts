import { Address, BigInt } from "@graphprotocol/graph-ts"
import {
  ItemBought as ItemBoughtEvent,
  ItemCanceled as ItemCanceledEvent,
  ItemListed as ItemListedEvent,
  WithdrawSellerFund as WithdrawSellerFundEvent
} from "../generated/NftMarketplace/NftMarketplace"

import {
  ActiveItem,
  ItemBought,
  ItemListed,
  ItemCanceled
} from "../generated/schema"

/* 
  empty buyer address = it listed
  0xdEaD address = it canceled
  Have an address = it bought
*/

export function handleItemBought(event: ItemBoughtEvent): void {
  let itemBought = ItemBought.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  )
  let activeItem = ActiveItem.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  )
  if (!itemBought) {
    itemBought = new ItemBought(
      getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    )
  }
  itemBought.buyer = event.params.buyer
  itemBought.nftAddress = event.params.nftAddress
  itemBought.tokenId = event.params.tokenId
  // if have buyer mean it bought, if not it still on market
  activeItem!.buyer = event.params.buyer

  itemBought.save()
  activeItem!.save()
}

export function handleItemCanceled(event: ItemCanceledEvent): void {
  // const { tokenId, nftAddress, seller } = event.params
  const tokenId = event.params.tokenId
  const nftAddress = event.params.nftAddress
  const seller = event.params.seller

  const id = getIdFromEventParams(tokenId, nftAddress)
  let itemCanceled = ItemCanceled.load(id)
  let activeItem = ActiveItem.load(id)
  if (!itemCanceled) {
    itemCanceled = new ItemCanceled(id)
  }

  itemCanceled.tokenId = tokenId
  itemCanceled.nftAddress = nftAddress
  itemCanceled.seller = seller

  activeItem!.buyer = Address.fromString(
    "0x000000000000000000000000000000000000dEaD"
  )

  itemCanceled.save()
  activeItem!.save()
}

export function handleItemListed(event: ItemListedEvent): void {
  // Save that event in our graph
  // update ActiveItem
  // get or create an itemlisted object
  // each item needs a unque Id
  // ItemListEvent: just the raw event
  // ItemListObject: What we save
  // const { tokenId, nftAddress, seller, price } = event.params
  const tokenId = event.params.tokenId
  const nftAddress = event.params.nftAddress
  const seller = event.params.seller
  const price = event.params.price

  const id = getIdFromEventParams(tokenId, nftAddress)
  let itemListed = ItemListed.load(id)
  let activeItem = ActiveItem.load(id)
  if (!itemListed) {
    itemListed = new ItemListed(id)
  }
  if (!activeItem) {
    activeItem = new ActiveItem(id)
  }

  itemListed.tokenId = tokenId
  itemListed.nftAddress = nftAddress
  itemListed.seller = seller
  itemListed.price = price

  activeItem.tokenId = tokenId
  activeItem.nftAddress = nftAddress
  activeItem.seller = seller
  activeItem.price = price
  activeItem.buyer = Address.fromString(
    "0x0000000000000000000000000000000000000000"
  )

  itemListed.save()
  activeItem.save()
}

export function handleWithdrawSellerFund(
  event: WithdrawSellerFundEvent
): void {}

export function getIdFromEventParams(
  tokenId: BigInt,
  nftAddress: Address
): string {
  return `${tokenId.toHexString()}${nftAddress.toHexString()}`
}
