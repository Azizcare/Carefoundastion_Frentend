
import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-green-900/95 backdrop-blur-md shadow-2xl rounded-t-3xl text-white py-16 relative overflow-hidden">
      
      <div className="absolute top-0 left-0 w-72 h-72 bg-green-500/30 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-cyan-400/30 rounded-full blur-3xl -z-10 animate-pulse"></div>

      <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-10">

        <div className="flex flex-col items-start animate-fadeIn">
          <Link href="/" className="flex items-center gap-3 mb-4 transform hover:scale-105 transition duration-500">
            <Image
              src="/logo.webp"
              alt="Care Foundation Logo"
              width={210}
              height={100}
              className="hover:drop-shadow-xl transition-transform duration-500"
            />
          </Link>
          <p className="text-xs text-gray-300 mb-2">Est Since - 1997</p>
          <p className="text-sm text-gray-300 mb-3">
            Care Foundation Trust is a non-profit organisation committed to compassion and empathy. Our goal is to address critical social issues and uplift lives.
          </p>

          <div className="flex space-x-4 mt-5">
            {[FaFacebookF, FaInstagram, FaTwitter, FaYoutube].map((Icon, idx) => (
              <a
                key={idx}
                href="#"
                className="p-3 bg-white/20 rounded-full hover:bg-gradient-to-r from-lime-500 to-green-500 text-white hover:text-white shadow-md hover:shadow-lg transition transform hover:scale-125"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <div className="group relative animate-fadeIn delay-200">
          <h3 className="font-semibold text-lg mb-4 cursor-pointer">Resources</h3>
          <ul className="space-y-2 text-gray-300 opacity-80 group-hover:opacity-100 transition duration-300">
            {["How It Works","Ask A Question","Project Story","Mission","Certificates","Terms And Conditions"].map((item, idx) => (
              <li
                key={idx}
                className="hover:text-green-400 hover:underline decoration-2 decoration-green-400 transition cursor-pointer"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="group relative animate-fadeIn delay-400">
          <h3 className="font-semibold text-lg mb-4 cursor-pointer">Company</h3>
          <ul className="space-y-2 text-gray-300 opacity-80 group-hover:opacity-100 transition duration-300">
            {["About Us","Volunteer","Happy Clients","Project","Contact Us","FAQ"].map((item, idx) => (
              <li
                key={idx}
                className="hover:text-green-400 hover:underline decoration-2 decoration-green-400 transition cursor-pointer"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6 animate-fadeIn delay-600">
          <h3 className="font-semibold text-lg mb-4">Get in Touch</h3>
          <ul className="space-y-4 text-gray-300">
            <li className="flex items-start space-x-2">
              <FiMapPin className="text-green-400 mt-1" />
              <span>AL-EZZ building (SBUT), Ibrahim Rehmattullah Road, Bhendi Bazaar, Mumbai – 400003.</span>
            </li>
            <li className="flex items-center space-x-2">
              <FiPhone className="text-green-400" />
              <span>+91 9867491052</span>
            </li>
            <li className="flex items-center space-x-2">
              <FiMail className="text-green-400" />
              <span>carefoundationtrustorg@gmail.com</span>
            </li>
          </ul>

          <div className="mt-3">
            <h4 className="text-sm font-medium mb-2">Subscribe to Newsletter</h4>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 rounded-l-lg focus:ring-2 focus:ring-green-400 border border-gray-300 outline-none text-gray-900 placeholder-gray-500"
              />
              <button className="bg-gradient-to-r from-green-600 to-green-700  px-4 rounded-r-lg font-semibold transition transform hover:scale-105 shadow-md">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}


