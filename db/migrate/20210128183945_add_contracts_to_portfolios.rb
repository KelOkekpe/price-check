class AddContractsToPortfolios < ActiveRecord::Migration[6.0]
  def change
    add_column :portfolios, :contracts, :json
  end
end
