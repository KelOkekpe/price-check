class RemoveTickersFromPortfolios2 < ActiveRecord::Migration[6.0]
  def change
    remove_column :portfolios, :tickers, :json
  end
end
