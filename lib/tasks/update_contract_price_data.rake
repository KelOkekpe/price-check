require 'csv'

namespace :contracts do
    desc "Export daily premium prices for every contract"
      task :update_daily_premium_prices => :environment do

        Contract.where(has_csv: true).each do |contract|
            file = "#{Rails.root}/public/#{contract.ticker}_contract_price_history.csv"
            
            CSV.open(file, 'a+') do |writer|
                contract.daily_premium_prices.each do |price|
                    writer << [price[0].partition(" ").last, price[0].partition(" ").first, price[1]]
                end
            end
            puts "updated #{contract.ticker} premium prices csv successfully"
        end
        contract.daily_premium_prices = []
        contract.save!
        puts "cleared #{contract.ticker} premium prices array, it will reset tomorrow"
    end
end
  