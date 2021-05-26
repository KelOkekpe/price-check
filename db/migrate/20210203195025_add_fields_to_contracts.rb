class AddFieldsToContracts < ActiveRecord::Migration[6.0]
  def change
    add_column :contracts, :strike_price, :decimal
    add_column :contracts, :type, :string
    add_column :contracts, :expiration_date, :datetime
    add_column :contracts, :premium_price, :decimal
    add_column :contracts, :average_premium_purchase_price, :decimal
  end
end
