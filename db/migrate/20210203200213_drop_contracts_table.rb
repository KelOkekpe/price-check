class DropContractsTable < ActiveRecord::Migration[6.0]
  def up
    drop_table :contracts
  end
end
