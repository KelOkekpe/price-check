class AddTickerToContracts < ActiveRecord::Migration[6.0]
  def change
    add_column :contracts, :ticker, :string, first: true
  end
end
