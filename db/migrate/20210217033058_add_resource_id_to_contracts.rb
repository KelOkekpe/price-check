class AddResourceIdToContracts < ActiveRecord::Migration[6.0]
  def change
    add_column :contracts, :resource_id, :string
  end
end
