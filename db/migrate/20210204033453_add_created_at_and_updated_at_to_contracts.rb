class AddCreatedAtAndUpdatedAtToContracts < ActiveRecord::Migration[6.0]
  def change
    add_column :contracts, :created_at, :datetime, null: false
    add_column :contracts, :updated_at, :datetime, null: false
  end
end
