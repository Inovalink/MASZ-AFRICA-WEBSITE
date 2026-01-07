'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MoveRight } from 'lucide-react';
import gsap from 'gsap';

export const navLinks = [
  { id: '1', label: 'home', path: '/' },
  { id: '2', label: 'about', path: '/aboutUs' },
  { id: '3', label: 'services', path: '/services' },
  { id: '4', label: 'careers', path: '/careers' },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [activeLink, setActiveLink] = useState(navLinks[0].label); // default: home

  // Hide menu initially
  useEffect(() => {
    if (menuRef.current) {
      gsap.set(menuRef.current, {
        scaleY: 0,
        opacity: 0,
        transformOrigin: 'top',
      });
      itemRefs.current.forEach((el) => {
        if (el) gsap.set(el, { y: 20, opacity: 0 });
        const arrow = el?.querySelector('svg');
        if (arrow) gsap.set(arrow, { x: -20, opacity: 0 });
      });
    }
  }, []);

  // Animate menu open/close
  useEffect(() => {
    if (!menuRef.current) return;

    const tl = gsap.timeline({ defaults: { ease: 'power4.inOut' } });

    if (menuOpen) {
      tl.to(menuRef.current, { scaleY: 1, opacity: 1, duration: 0.65 });
      tl.to(
        itemRefs.current,
        { y: 0, opacity: 1, stagger: 0.12, duration: 0.6 },
        '-=0.45'
      );
      tl.to(
        itemRefs.current.map((el) => el?.querySelector('svg')),
        { x: 0, opacity: 1, stagger: 0.12, duration: 0.5 },
        '-=0.55'
      );
    } else {
      tl.to(
        itemRefs.current.map((el) => el?.querySelector('svg')),
        { x: -20, opacity: 0, stagger: 0.08, duration: 0.35 }
      );
      tl.to(
        itemRefs.current,
        { y: 20, opacity: 0, stagger: 0.1, duration: 0.45, ease: 'power3.in' },
        '-=0.2'
      );
      tl.to(
        menuRef.current,
        {
          scaleY: 0,
          opacity: 0,
          duration: 0.6,
          transformOrigin: 'top',
          ease: 'power4.inOut',
        },
        '-=0.3'
      );
    }
  }, [menuOpen]);

  return (
    <header className="navbar left-0 right-0 z-[100]  w-full h-[90]">
      <div className="main-nav-container flex justify-between items-center h-full mx-[20] lg:mx-[150]">
        <div className="nav-logo">
          <Image
            src="/maszAssets/website-logo.svg"
            width={140}
            height={50}
            alt="masz africa logo"
            style={{ height: 25, width: 'auto' }}
          />
        </div>

        <div className="nav-list flex items-center">
          <div className="large-screens-navbar hidden lg:flex mr-[50] p-[20] text-default-body">
            <ul className="large-screen-navbar-list flex gap-12 uppercase items-center text-md-medium">
              {navLinks.map((list) => (
                <li key={list.id} className="relative">
                  <Link
                    href={list.path}
                    onClick={() => setActiveLink(list.label)}
                    className={`
                      relative inline-block px-1 py-1 font-medium text-default-body
                      before:content-[''] before:absolute before:left-0 before:top-[-10px] before:h-[4px] before:w-0 before:bg-blue-500 before:transition-all before:duration-300
                      after:content-[''] after:absolute after:left-0 after:bottom-[-10px] after:h-[4px] after:w-0 after:bg-blue-500 after:transition-all after:duration-300
                      hover:before:w-full hover:after:w-full
                      ${activeLink === list.label ? 'before:w-full after:w-full' : ''}
          `}
                  >
                    {list.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="contact-us-cta flex justify-between items-center mr-[10]">
            <Link
              href="/contactUs"
              className="font-medium bg-surface-card-colored-primary text-light px-[8] py-[7] flex"
            >
              Contact Us
              <MoveRight size={20} className="mt-[2] mx-1" />
            </Link>
          </div>

          <div
            className="menu-icon ml-2 w-[30] h-[30] flex flex-col justify-center items-center gap-[4] cursor-pointer lg:hidden"
            onClick={toggleMenu}
          >
            <span
              className={`block h-[3] w-full bg-black rounded transform transition-all duration-500 ease-in-out ${
                menuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`block h-[3] w-full bg-black rounded transition-all duration-500 ease-in-out ${
                menuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block h-[3] w-full bg-black rounded transform transition-all duration-500 ease-in-out ${
                menuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </div>
        </div>

        <div
          ref={menuRef}
          className="nav-bar-list-items bg-surface-card-primary fixed z-40 top-22 w-full left-0 right-0 h-full transform origin-top lg:hidden"
        >
          <ul className="navList-item">
            {navLinks.map((link, index) => (
              <li
                key={link.id}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                className="border-b border-gray-500 px-[18] py-[20] flex justify-between items-center"
              >
                <Link
                  href={link.path}
                  className="capitalize text-3xl-regular"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
                <MoveRight
                  size={20}
                  className={`transform transition-all duration-500 ease-in-out ${
                    menuOpen
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 -translate-x-4'
                  }`}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
