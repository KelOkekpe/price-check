class AddOptionTypeToContracts < ActiveRecord::Migration[6.0]
  def change
    add_column :contracts, :option_type, :string
  end
end
