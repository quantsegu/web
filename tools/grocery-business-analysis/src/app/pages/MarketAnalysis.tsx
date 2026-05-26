import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Users, TrendingUp, MapPin, Package, AlertTriangle, Target } from "lucide-react";

export function MarketAnalysis() {
  const marketSizeData = [
    { country: 'Germany', population: '150K', marketSize: 1800, growth: 8 },
    { country: 'Italy', population: '45K', marketSize: 720, growth: 9 },
    { country: 'Poland', population: '42K', marketSize: 950, growth: 9 },
    { country: 'Switzerland', population: '35K', marketSize: 750, growth: 6 },
    { country: 'Romania', population: '18K', marketSize: 520, growth: 10 },
    { country: 'Czech Rep.', population: '22K', marketSize: 480, growth: 8 },
    { country: 'Hungary', population: '13K', marketSize: 380, growth: 8 },
  ];
  
  const demographicData = [
    { segment: 'Young Professionals', percentage: 35, value: 35 },
    { segment: 'Families', percentage: 40, value: 40 },
    { segment: 'Students', percentage: 15, value: 15 },
    { segment: 'Retirees', percentage: 10, value: 10 },
  ];
  
  const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#c084fc'];
  
  const productCategoryData = [
    { category: 'Spices & Lentils', demand: 'Very High', margin: '65%', competition: 'Medium' },
    { category: 'Pooja Items', demand: 'High', margin: '60%', competition: 'Low' },
    { category: 'Snacks & Sweets', demand: 'High', margin: '55%', competition: 'High' },
    { category: 'Fresh Produce', demand: 'Medium', margin: '50%', competition: 'Very High' },
    { category: 'Frozen Items', demand: 'Medium', margin: '45%', competition: 'Medium' },
  ];
  
  const competitorData = [
    { name: 'Existing Local Indian Stores', threat: 'High', advantage: 'Physical presence, immediate pickup' },
    { name: 'Amazon/General E-commerce', threat: 'Medium', advantage: 'Scale, fast delivery' },
    { name: 'Specialty Online Stores', threat: 'High', advantage: 'Established customer base' },
    { name: 'Direct Import Services', threat: 'Low', advantage: 'Lower prices but slow delivery' },
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Market Analysis</h2>
        <p className="text-gray-600">
          Detailed analysis of market opportunity, demographics, and competitive landscape
        </p>
      </div>
      
      {/* Market Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Market</p>
              <p className="text-2xl font-bold text-gray-900">~325K</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Indian diaspora across Germany, Italy, Switzerland, and CEE markets
          </p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Market Value</p>
              <p className="text-2xl font-bold text-gray-900">€4.8M</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Estimated annual market size for Indian grocery & pooja items
          </p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Growth Rate</p>
              <p className="text-2xl font-bold text-gray-900">7-8%</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Annual growth in online ethnic grocery shopping
          </p>
        </div>
      </div>
      
      {/* Market Size by Country */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Market Size by Country</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={marketSizeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="country" />
                <YAxis label={{ value: 'Market Size (€K)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value: number) => `€${value}K`} />
                <Bar dataKey="marketSize" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-4">
            {marketSizeData.map((data) => (
              <div key={data.country} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{data.country}</span>
                  <span className="text-sm text-gray-600">{data.population} Indian population</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Estimated Market Size</span>
                  <span className="font-semibold text-indigo-600">€{data.marketSize}K/year</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Annual Growth</span>
                  <span className="font-semibold text-green-600">+{data.growth}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-900 mb-1">🇩🇪 Germany — largest market</p>
            <p className="text-xs text-gray-700">
              Biggest diaspora and order volume; ideal Western EU export hub with strong domestic demand.
            </p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm font-medium text-orange-900 mb-1">🇮🇹 Italy</p>
            <p className="text-xs text-orange-800">
              Milan and Rome corridors; competitive last-mile within EU, good bridge to Southern Europe.
            </p>
          </div>
          <div className="bg-red-50 border border-red-300 rounded-lg p-4">
            <p className="text-sm font-medium text-red-900 mb-1">🇨🇭 Switzerland</p>
            <p className="text-xs text-red-800">
              Premium baskets but customs on EU lanes — best when Swiss share of orders is high.
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-900 mb-1">🇵🇱 Poland — CEE anchor</p>
            <p className="text-xs text-blue-800">
              Largest Indian community in CEE; Warsaw, Kraków, and Wrocław corridors. Strong IT hiring drives online grocery demand.
            </p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm font-medium text-yellow-900 mb-1">🇷🇴 Romania — cost-efficient hub</p>
            <p className="text-xs text-yellow-800">
              Lower warehouse and labor costs; Bucharest and Cluj delivery zones. Competitive shipping to Hungary and Bulgaria.
            </p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm font-medium text-red-900 mb-1">🇨🇿 Czech Republic</p>
            <p className="text-xs text-red-800">
              Prague-centric diaspora with higher basket sizes. Central position for cross-border EU parcels.
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm font-medium text-green-900 mb-1">🇭🇺 Hungary</p>
            <p className="text-xs text-green-800">
              Budapest hub; growing student and professional segment. Good last-mile density in capital region.
            </p>
          </div>
        </div>
      </div>
      
      {/* Customer Demographics */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Customer Demographics</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={demographicData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ segment, percentage }) => `${segment} ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {demographicData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-3">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Families (40%)</h4>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Age:</strong> 30-50 years | <strong>Avg. Order:</strong> €60-80
              </p>
              <p className="text-xs text-gray-600">
                Regular buyers of groceries, spices, and cooking ingredients. High repeat purchase rate. 
                Value quality and authenticity.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Young Professionals (35%)</h4>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Age:</strong> 25-35 years | <strong>Avg. Order:</strong> €40-50
              </p>
              <p className="text-xs text-gray-600">
                Tech-savvy, prefer online shopping. Buy ready-to-eat snacks, instant mixes, and convenience items. 
                Price sensitive but value convenience.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Students (15%)</h4>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Age:</strong> 18-25 years | <strong>Avg. Order:</strong> €25-35
              </p>
              <p className="text-xs text-gray-600">
                Budget-conscious, buy in small quantities. Prefer affordable snacks and basic cooking ingredients. 
                Share orders with roommates.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Categories */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Product Category Analysis</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Demand</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Margin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Competition</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {productCategoryData.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{item.category}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      item.demand === 'Very High' ? 'bg-green-100 text-green-700' :
                      item.demand === 'High' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {item.demand}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-green-600">{item.margin}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      item.competition === 'Low' ? 'bg-green-100 text-green-700' :
                      item.competition === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {item.competition}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.demand === 'Very High' && item.margin === '65%' ? 'Priority Focus' :
                     item.demand === 'High' && item.competition === 'Low' ? 'Great Opportunity' :
                     item.competition === 'Very High' ? 'Consider Carefully' :
                     'Moderate Priority'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Competitive Landscape */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Competitive Landscape</h3>
        <div className="space-y-4">
          {competitorData.map((comp, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900">{comp.name}</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  comp.threat === 'High' ? 'bg-red-100 text-red-700' :
                  comp.threat === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {comp.threat} Threat
                </span>
              </div>
              <p className="text-sm text-gray-600">
                <strong>Their Advantage:</strong> {comp.advantage}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <h4 className="font-medium text-indigo-900 mb-2">Your Competitive Advantages</h4>
          <ul className="space-y-1 text-sm text-indigo-800">
            <li className="flex gap-2">
              <span>✓</span>
              <span><strong>Specialized Focus:</strong> Exclusive Indian grocery & pooja items with authentic sourcing</span>
            </li>
            <li className="flex gap-2">
              <span>✓</span>
              <span><strong>Multi-Country Delivery:</strong> Serve Poland, Romania, Czech Republic, and Hungary from regional hubs</span>
            </li>
            <li className="flex gap-2">
              <span>✓</span>
              <span><strong>Cultural Understanding:</strong> Know exactly what Indian diaspora wants and needs</span>
            </li>
            <li className="flex gap-2">
              <span>✓</span>
              <span><strong>Modern Platform:</strong> Better user experience than traditional stores, faster than direct imports</span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Key Challenges & Opportunities */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-red-900">Key Challenges</h3>
          </div>
          <ul className="space-y-3 text-sm text-red-800">
            <li className="flex gap-2">
              <span className="text-red-500 font-bold">•</span>
              <span><strong>High Customer Acquisition Cost:</strong> Need €8-12 per customer in competitive market</span>
            </li>
            <li className="flex gap-2">
              <span className="text-red-500 font-bold">•</span>
              <span><strong>Cross-Border Logistics:</strong> EU-internal shipping still needs reliable carriers and surcharge modeling</span>
            </li>
            <li className="flex gap-2">
              <span className="text-red-500 font-bold">•</span>
              <span><strong>Established Competition:</strong> Local stores and major e-commerce players already present</span>
            </li>
            <li className="flex gap-2">
              <span className="text-red-500 font-bold">•</span>
              <span><strong>Product Sourcing:</strong> Maintaining consistent supply from India while managing costs</span>
            </li>
            <li className="flex gap-2">
              <span className="text-red-500 font-bold">•</span>
              <span><strong>Minimum Scale:</strong> Need 300-400 orders/month minimum to be profitable</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-green-900">Key Opportunities</h3>
          </div>
          <ul className="space-y-3 text-sm text-green-800">
            <li className="flex gap-2">
              <span className="text-green-500 font-bold">•</span>
              <span><strong>Underserved Market:</strong> Limited specialized Indian grocery delivery services</span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-500 font-bold">•</span>
              <span><strong>Growing Diaspora:</strong> 7-8% annual growth in target demographics</span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-500 font-bold">•</span>
              <span><strong>Lower OpEx:</strong> CEE fulfillment hubs reduce warehouse and labor vs Western Europe</span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-500 font-bold">•</span>
              <span><strong>Recurring Revenue:</strong> Grocery items drive repeat purchases every 2-4 weeks</span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-500 font-bold">•</span>
              <span><strong>Festival Spikes:</strong> Diwali, Holi, and other festivals drive 2-3x order volume</span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Strategic Recommendations */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <h3 className="font-semibold text-xl mb-4">Strategic Recommendations</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Phase 1: Launch (Months 1-6)</h4>
            <ul className="space-y-2 text-sm text-indigo-100">
              <li>• Start with Romania or Poland hub for lowest fulfillment cost</li>
              <li>• Focus on high-margin, high-demand items (spices, pooja)</li>
              <li>• Target Warsaw, Bucharest, Prague, Budapest first</li>
              <li>• Build community through social media and events</li>
              <li>• Aim for 200-300 orders/month initially</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Phase 2: Scale (Months 7-18)</h4>
            <ul className="space-y-2 text-sm text-indigo-100">
              <li>• Add second hub (e.g. Poland + Romania) once volume justifies</li>
              <li>• Add more product categories based on demand</li>
              <li>• Tune delivery matrix per hub in Settings as carriers negotiate rates</li>
              <li>• Implement subscription/loyalty programs</li>
              <li>• Target 500-800 orders/month for solid profitability</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}