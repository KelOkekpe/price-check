class ChangePremiumTypeToBeFloatInContracts < ActiveRecord::Migration[6.0]
  def change
    change_column :contracts, :premium, :float
  end
end
