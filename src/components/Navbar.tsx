import { useEffect, useState } from 'react'
import Logo from '../assets/logo000.png'

const Navbar = () => {

  // scroll spy tipo apple
  const [active, setActive] = useState('home')

useEffect(() => {
  const sections = ['home', 'servicos', 'sobre', 'contato']

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id)
        }
      })
    },
    {
      threshold: 0.6,
    }
  )

  sections.forEach((id) => {
    const el = document.getElementById(id)
    if (el) observer.observe(el)
  })

  return () => observer.disconnect()
}, [])

// scroll spy tipo apple


  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const menu = [
  { name: 'Home', link: '#home' },
  { name: 'Serviços', link: '#servicos' },
  { name: 'Sobre', link: '#sobre' },
  { name: 'Contato', link: '#contato' },
]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white shadow-lg border-b border-gray-100'
            : 'bg-white/40 backdrop-blur-md'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-20">

          {/* Logo */}
          <a href="#home">
            <img src={Logo} alt="Lar & Soluções" className="h-12 w-auto" />
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 text-gray-700 font-medium">
            {menu.map((item) => (
              <a
                key={item.name}
                href={item.link}
                className="relative group text-gray-700"
              >
                {item.name}

                <span
                  className={`absolute left-0 -bottom-1 h-[2px] bg-sky-600 transition-all duration-300 ${
                    active === item.link.replace('#', '')
                      ? 'w-full'
                      : 'w-0 group-hover:w-full'
                  }`}
                />
              </a>
            ))}
          </div>

          {/* Login */}
          <button className="hidden md:block px-5 py-2 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700 transition">
            Login
          </button>

          {/* Mobile Button */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setIsOpen(true)}
          >
            ☰
          </button>
        </div>
      </nav>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-xl transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 flex flex-col space-y-6">
          <button
            className="text-right text-xl"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>

          {menu.map((item) => (
            <a
              key={item.name}
              href={item.link}
              onClick={() => setIsOpen(false)}
              className="relative text-lg font-medium group w-fit"
            >
              {item.name}
              <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-sky-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        

          <button className="mt-4 px-5 py-2 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700">
            Login
          </button>
        </div>
      </div>
    </>
  )
}

export default Navbar