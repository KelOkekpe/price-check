class AddHasCsvColumnToContracts < ActiveRecord::Migration[6.0]
  def change
    add_column :contracts, :has_csv, :boolean, default:false
  end
end
