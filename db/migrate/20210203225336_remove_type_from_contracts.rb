class RemoveTypeFromContracts < ActiveRecord::Migration[6.0]
  def change
    remove_column :contracts, :type, :string
  end
end
