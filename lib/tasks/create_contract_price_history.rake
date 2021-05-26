require 'csv'

namespace :contracts do
    desc "Export daily premium prices for every contract"
      task :create_price_csv_and_reset_array => :environment do

        Contract.where(has_csv: false).each do |contract|
            file = "#{Rails.root}/public/#{contract.ticker}_contract_price_history.csv"
            headers = ["Time","Date", "Price"]

            CSV.open(file, 'w', write_headers: true, headers: headers) do |writer|
                contract.daily_premium_prices.each do |price|
                    writer << [price[0].partition(" ").last, price[0].partition(" ").first, price[1]]
                end
            puts "updated #{contract.ticker} premium prices csv successfully"
            end
            contract.has_csv = true
            contract.daily_premium_prices = []
            contract.save!
            puts "cleared #{contract.ticker} premium prices array, it will reset tomorrow"
        end
    end
end
  