class AddTickersToPortfolios < ActiveRecord::Migration[6.0]
  def change
    add_column :portfolios, :tickers, :json
  end
end
