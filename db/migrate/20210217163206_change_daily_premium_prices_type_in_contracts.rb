class ChangeDailyPremiumPricesTypeInContracts < ActiveRecord::Migration[6.0]
  def change
    change_column :contracts, :daily_premium_prices, :string, array: true, default: []
  end
end
