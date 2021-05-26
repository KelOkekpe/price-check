class AddDailyPremiumPricesToContracts < ActiveRecord::Migration[6.0]
  def change
    add_column :contracts, :daily_premium_prices, :decimal, array: true, default: []
  end
end
