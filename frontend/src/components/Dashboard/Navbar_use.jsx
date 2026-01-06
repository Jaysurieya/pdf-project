import React, { useState } from 'react';
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarLogo,
  NavbarButton,
} from "./Navbar_component"; // Adjust the import path as needed

const NavbarUse = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Home', link: '#home' },
    { name: 'Features', link: '#features' },
    { name: 'Pricing', link: '#pricing' },
    { name: 'About', link: '#about' },
    { name: 'Contact', link: '#contact' },
  ];

  const handleItemClick = (e, item) => {
    e.preventDefault();
    setIsOpen(false);
    // Add your navigation logic here
    console.log('Clicked:', item.name);
  };

  return (
    <>
      {/* Desktop Navbar */}
      <div className="hidden lg:block">
        <Navbar>
          <NavBody className="max-w-7xl mx-auto w-full">
            <NavbarLogo />
            <NavItems items={navItems} onItemClick={handleItemClick} />
            <div className="flex items-center gap-2 relative z-20">
              <NavbarButton variant="secondary" href="#login">
                Login
              </NavbarButton>
              <NavbarButton variant="primary" href="#signup">
                Sign Up
              </NavbarButton>
            </div>
          </NavBody>
        </Navbar>
      </div>

      {/* Mobile Navbar */}
      <div className="lg:hidden">
        <MobileNav>
          <MobileNavHeader className="px-4">
            <NavbarLogo />
            <MobileNavToggle isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
          </MobileNavHeader>
          <MobileNavMenu isOpen={isOpen} onClose={() => setIsOpen(false)}>
            {navItems.map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                onClick={(e) => handleItemClick(e, item)}
                className="w-full text-left px-2 py-2 text-neutral-600 hover:text-neutral-900 font-medium"
              >
                {item.name}
              </a>
            ))}
            <div className="flex w-full flex-col gap-2 pt-4 border-t border-gray-200">
              <NavbarButton variant="secondary" href="#login" className="w-full">
                Login
              </NavbarButton>
              <NavbarButton variant="primary" href="#signup" className="w-full">
                Sign Up
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </div>
    </>
  );
};

export default NavbarUse;