class ChangeExpirationDateTypeToBeStringInContracts < ActiveRecord::Migration[6.0]
  def change
    change_column :contracts, :expiration_date, :string
  end
end
