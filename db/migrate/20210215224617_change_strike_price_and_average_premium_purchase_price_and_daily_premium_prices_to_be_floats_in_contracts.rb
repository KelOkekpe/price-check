class ChangeStrikePriceAndAveragePremiumPurchasePriceAndDailyPremiumPricesToBeFloatsInContracts < ActiveRecord::Migration[6.0]
  def change
    change_column :contracts, :strike_price, :float
    change_column :contracts, :average_premium_purchase_price, :float
    change_column :contracts, :daily_premium_prices, :float, array: true, default: []
  end
end
