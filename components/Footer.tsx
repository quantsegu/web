import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative py-10 px-4 sm:px-6 lg:px-8 border-t border-saffron-800/30">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="sm:col-span-2 lg:col-span-2">
            <h3 className="text-xl font-bold text-white mb-4">Shreshti</h3>
            <p className="text-gray-300 mb-4 max-w-md">
              Established in the Netherlands, Shreshti is a dynamic organization with subsidiaries spanning multiple industries and regions.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-saffron-300 transition-colors duration-200">Home</Link></li>
              <li><a href="/#sanatan-dharma" className="text-gray-300 hover:text-saffron-300 transition-colors duration-200">Sanātana Dharma</a></li>
              <li><a href="/#subsidiaries" className="text-gray-300 hover:text-saffron-300 transition-colors duration-200">Subsidiaries</a></li>
              <li><a href="/#collaborations" className="text-gray-300 hover:text-saffron-300 transition-colors duration-200">Collaborations</a></li>
              <li><Link to="/software" className="text-gray-300 hover:text-saffron-300 transition-colors duration-200">Software</Link></li>
              <li><Link to="/wealth-tools" className="text-gray-300 hover:text-saffron-300 transition-colors duration-200">Wealth Tools</Link></li>
              <li><a href="/resources.html" className="text-gray-300 hover:text-saffron-300 transition-colors duration-200">Resources Hub</a></li>
              <li><Link to="/wealth-tools/investment-universe" className="text-gray-300 hover:text-saffron-300 transition-colors duration-200">Investment Universe</Link></li>
              <li><a href="/wealth-tools/retirement-income-planner" className="text-gray-300 hover:text-saffron-300 transition-colors duration-200">Retirement Income Planner</a></li>
              <li><Link to="/communities" className="text-gray-300 hover:text-saffron-300 transition-colors duration-200">Indian Communities</Link></li>
              <li><a href="https://disciplined-recreation-production.up.railway.app/login" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-saffron-300 transition-colors duration-200">Balaji POS Login</a></li>
              <li><a href="/#contact" className="text-gray-300 hover:text-saffron-300 transition-colors duration-200">Contact</a></li>
              <li><Link to="/bjp" className="text-gray-400 hover:text-saffron-300 transition-colors duration-200 text-sm">BJP support (personal)</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Our Companies</h4>
            <ul className="space-y-2">
              <li><a href="https://ecosphere.cc/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-saffron-300 transition-colors duration-200">Ecosphere Trade BV</a></li>
              <li><a href="https://balaji.nl/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-saffron-300 transition-colors duration-200">Balaji</a></li>
              <li><a href="https://ofbjpnetherlands.org/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-saffron-300 transition-colors duration-200">OFBJP Netherlands</a></li>
              <li><a href="/#subsidiaries" className="text-gray-300 hover:text-saffron-300 transition-colors duration-200">Shri Sai Ram Financials</a></li>
              <li><a href="https://brink-trick-47383861.figma.site/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-saffron-300 transition-colors duration-200">Where the Alps Meet the Vedas</a></li>
              <li><a href="/#subsidiaries" className="text-gray-300 hover:text-saffron-300 transition-colors duration-200">Emanate</a></li>
              <li><a href="https://sanatanadharmaway.eu/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-saffron-300 transition-colors duration-200">Sanātana Dharma Way</a></li>
              <li><a href="/#subsidiaries" className="text-gray-300 hover:text-saffron-300 transition-colors duration-200">Dutch Caution</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Collaborations</h4>
            <ul className="space-y-2">
              <li><a href="https://quantamixsolutions.com/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-saffron-300 transition-colors duration-200">Quantamix Solutions</a></li>
              <li><a href="https://kensofi.com/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-saffron-300 transition-colors duration-200">KensoFI</a></li>
              <li><a href="https://www.lekhly.com/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-saffron-300 transition-colors duration-200">Lekhly</a></li>
              <li><a href="https://www.bjp.org/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-saffron-300 transition-colors duration-200">BJP (Official)</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-saffron-800/30 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} Shreshti. All rights reserved.
          </p>
          
          <div className="mt-4 md:mt-0 flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-saffron-300 transition-colors duration-200">
              <span className="sr-only">LinkedIn</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-saffron-300 transition-colors duration-200">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
