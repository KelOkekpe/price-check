class ChangePremiumToBeIntegerInContracts < ActiveRecord::Migration[6.0]
  def change
    change_column :contracts, :premium, :integer
  end
end
