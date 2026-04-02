import { ShoppingCart, MapPin, Phone, DollarSign } from 'lucide-react';

const MARKET_DATA = {
  pesticides: [
    { name: "Mancozeb 75WP", price: 350, unit: "500g", availability: "In Stock", shops: "Krishi Kendra Nashik, Agro Mart Pune" },
    { name: "Difenoconazole 25EC", price: 1250, unit: "250ml", availability: "In Stock", shops: "Green Farm Supplies Nashik" },
    { name: "Imidacloprid 17.8SL", price: 850, unit: "100ml", availability: "Low Stock", shops: "Maharashtra Agro Solapur" },
  ],
  nutrients: [
    { name: "Urea 46-00", price: 242, unit: "50kg", availability: "In Stock", shops: "All Local Co-ops" },
    { name: "DAP 18-46-0", price: 1350, unit: "50kg", availability: "In Stock", shops: "Krishi Kendra" },
    { name: "19-19-19 NPK", price: 1450, unit: "50kg", availability: "In Stock", shops: "Agro Mart" },
  ],
  localShops: [
    { name: "Krishi Kendra", location: "Nashik Main Market", phone: "98765-43210", rating: 4.8 },
    { name: "Agro Mart", location: "Pune Station Road", phone: "98765-43211", rating: 4.5 },
    { name: "Shree Ram Agri", location: "Solapur MIDC", phone: "98765-43212", rating: 4.7 },
  ]
};

export default function MarketTab() {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-800">
        <ShoppingCart className="w-8 h-8 text-orange-500" />
        🛒 Local Market & Agri Shops
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pesticides */}
        <div>
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-orange-600">
            🛡️ Pesticides & Fungicides
          </h3>
          <div className="space-y-3">
            {MARKET_DATA.pesticides.map((item, i) => (
              <div key={i} className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-4 hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-gray-800">{item.name}</h4>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-bold">
                    ₹{item.price}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{item.unit} - {item.availability}</p>
                <p className="text-xs text-blue-600 mt-1 font-medium">{item.shops}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Nutrients */}
        <div>
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-green-600">
            🌱 Fertilizers & Nutrients
          </h3>
          <div className="space-y-3">
            {MARKET_DATA.nutrients.map((item, i) => (
              <div key={i} className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-gray-800">{item.name}</h4>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-bold">
                    ₹{item.price}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{item.unit} - {item.availability}</p>
                <p className="text-xs text-blue-600 mt-1 font-medium">{item.shops}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Local Shops */}
      <div>
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-purple-600">
          🏪 Nearest Agri Shops
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MARKET_DATA.localShops.map((shop, i) => (
            <div key={i} className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="flex items-start gap-3 mb-3">
                <MapPin className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-800 text-lg">{shop.name}</h4>
                  <p className="text-sm text-gray-600">{shop.location}</p>
                  <p className="text-sm font-semibold text-blue-600 mt-1 flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {shop.phone}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm text-yellow-600">
                ★ {shop.rating} (248 reviews)
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center pt-4 border-t text-xs text-gray-500">
        Prices updated daily • Call to confirm stock • 10km radius
      </div>
    </div>
  );
}

