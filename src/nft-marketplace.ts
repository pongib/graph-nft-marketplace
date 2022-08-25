import {
  ItemBought as ItemBoughtEvent,
  ItemCanceled as ItemCanceledEvent,
  ItemListed as ItemListedEvent,
  WithdrawSellerFund as WithdrawSellerFundEvent,
} from "../generated/NftMarketplace/NftMarketplace";

export function handleItemBought(event: ItemBoughtEvent): void {}

export function handleItemCanceled(event: ItemCanceledEvent): void {}

export function handleItemListed(event: ItemListedEvent): void {
  // Save that event in our graph
  // update ActiveItem
  // get or create an itemlisted object
  // each item needs a unque Id
  // ItemListEvent: just the raw event
  // ItemListObject: What we save
}

export function handleWithdrawSellerFund(
  event: WithdrawSellerFundEvent
): void {}
