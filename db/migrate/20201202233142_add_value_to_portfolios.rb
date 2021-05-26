class AddValueToPortfolios < ActiveRecord::Migration[6.0]
  def change
    add_column :portfolios, :value, :string
  end
end
