class ChangeDailyPremiumPricesTypeToBeJsonInContracts < ActiveRecord::Migration[6.0]
  def change
    remove_column :contracts, :daily_premium_prices
    add_column :contracts, :daily_premium_prices, :json, null:false, default:{}
  end
end
