export default function Footer() {
  return (
    <footer className="bg-abstract-black text-white pt-16 pb-8 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h4 className="font-bold mb-4 text-lg">Abstract</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><a href="#" className="hover:text-white transition-colors">Branches</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold mb-4 text-lg">Resources</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Release Notes</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-lg">Community</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
            <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Dribbble</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Podcast</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-lg">Company</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Legal</a></li>
            <li className="mt-4"><span className="font-bold">Contact Us</span></li>
            <li><a href="mailto:info@abstract.com" className="hover:text-white transition-colors">info@agrimit.com</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
        <div className="mb-4 md:mb-0">
          <div className="font-bold text-white text-lg mb-2">AgriMit</div>
          <p>© Copyright 2026</p>
          <p>AgriMit Crop Intelligence, Inc.</p>
          <p>All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}
