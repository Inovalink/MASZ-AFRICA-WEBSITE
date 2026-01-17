import React from 'react';
import Image from 'next/image';
import { title } from 'process';
import Link from 'next/link';
import { Mail, Inbox, Phone, MapPin } from 'lucide-react';
import { Linkedin } from 'lucide-react';
import { IconBrandBehance } from '@tabler/icons-react';
import { IconBrandFacebook } from '@tabler/icons-react';
import { IconBrandTwitter } from '@tabler/icons-react';

function Footer() {
  const footerLinks = [
    {
      id: 1,
      title: 'About',
      path: '/aboutUs',
    },
    {
      id: 2,
      title: 'Services',
      path: '/services',
    },
    {
      id: 3,
      title: 'Careers',
      path: '/careers',
    },
    {
      id: 4,
      title: 'Contact Us',
      path: '/contactUs',
    },
  ];

  const addressObject = [
    {
      id: 1,
      description: 'admin@maszgh,com',
      icon: <Mail size={16} />,
    },
    {
      id: 2,
      description: (
        <>
          +233 24 416 3975 <br /> +233 54 095 3033
        </>
      ),
      icon: <Phone size={16} />,
    },
    {
      id: 3,
      description: 'P.O. Box 729, Tarkwa,Western Region, Ghana',
      icon: <Inbox size={16} />,
    },
    {
      id: 4,
      description: (
        <>
          House #17, Breeze Street, <br /> GT 353-5495, Community 16, Tema
        </>
      ),
      icon: <MapPin size={16} />,
    },
  ];

  return (
    <section className="bg-surface-overlay min-h-screen flex flex-col  px-6 lg:px-0 lg:flex ">
      <div className="main-footer-container lg:flex lg:mx-[240]">
        <div className="footer-left-column  w-full text-left text-sm-regular ">
          {/* Logo */}
          <div className="footer-logo-container relative w-[380px] h-[150px]  mb-6 lg:w-[600] lg:h-[300]">
            <Image
              src="/maszAssets/logo-white.svg"
              alt="footer logo"
              fill
              priority
              className="object-contain"
            />
          </div>

          {/* Subtext */}
          <p className="footer-subtext text-white text-sm-regular lg:text-md-regular leading-relaxed lg:w-[600]">
            MASZ-Africa is a trusted mining solutions company dedicated to
            supporting safe, efficient, and sustainable mining operations across
            Africa. We provide expert services in mining operations support,
            equipment supply, technical consultancy, safety solutions, and
            workforce training. With a strong focus on quality, innovation, and
            reliability, MASZ-Africa partners with clients to improve
            performance, reduce operational risks, and drive long-term success.
          </p>
        </div>

        {/* footer links */}
        <div className="footerlinks-plus-subscription lg:flex lg:flex-col lg:justify-between lg:h-[480]">
          <div className="footer-right-column my-[30] lg:my-[50] lg:w-[600]">
            <ul className="footer-link text-light text-md-regular lg:text-lg-regular lg:flex lg:justify-between">
              {footerLinks.map((item) => (
                <li key={item.id} className="my-[10] ">
                  <Link href={item.path}>{item.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Email subscription section */}

          <div className="subscription-session">
            <div className="upper-text text-light text-sm-regular  lg:w-[400]">
              Join our newsletter for more updates about our Company
            </div>
            <div className="input-and-button flex items-center my-[20] lg:w-full lg:justify-between">
              <div className="input-bar bg-surface-card-primary bg-surface-card-primary h-[60] w-[250] lg:w-[400] text-center flex justify-center mr-[20]">
                <input
                  type="text"
                  name="email"
                  placeholder="Enter your email"
                />
              </div>
              <div className="subscription-button text-light bg-surface-card-colored-primary flex justify-center text-center w-[120] lg:w-[170] rounded-full py-[20]">
                <button>Submit</button>
              </div>
            </div>
            <div className="lower-text text-light text-sm-regular lg:w-[400]">
              By subscribing, you agree to our privacy policy and email
              communications
            </div>
          </div>
        </div>
      </div>

      {/* Address details */}

      <div className="location-and-contact-details my-[30] ">
        <ul className="address-list lg:flex lg:justify-between lg:mx-[240] lg:my-[100] text-sm-regular">
          {addressObject.map((item) => (
            <li
              key={item.id}
              className="address-item text-light text-sm regular flex items-center my-[10] "
            >
              <div className="icon-container bg-surface-card-colored-primary p-[8] rounded-full mr-[15]">
                {item.icon}
              </div>
              <div className="address-text">{item.description}</div>
            </li>
          ))}
        </ul>
      </div>

      <div className="socials-container py-[30px] border-t border-blue-600 flex flex-col items-center justify-center">
        <div className="footer-socials flex items-center py-[] gap-4">
          {/* LinkedIn */}
          <div className="relative rounded-full">
            {/* background */}
            <div className="absolute inset-0 bg-surface-card-colored-primary opacity-40 rounded-full" />
            {/* icon */}
            <div className="relative p-[8px] text-primary-default">
              <Linkedin size={20} fill="currentColor" strokeWidth={0} />
            </div>
          </div>

          {/* Behance */}
          <div className="relative rounded-full">
            <div className="absolute inset-0 bg-surface-card-colored-primary opacity-40 rounded-full" />
            <div className="relative p-[8px] text-primary-default">
              <IconBrandBehance size={20} />
            </div>
          </div>

          {/* Facebook */}
          <div className="relative rounded-full">
            <div className="absolute inset-0 bg-surface-card-colored-primary opacity-40 rounded-full" />
            <div className="relative p-[8px] text-primary-default">
              <IconBrandFacebook size={20} fill="currentColor" stroke={0} />
            </div>
          </div>

          {/* Twitter */}
          <div className="relative rounded-full">
            <div className="absolute inset-0 bg-surface-card-colored-primary opacity-40 rounded-full" />
            <div className="relative p-[8px] text-primary-default">
              <IconBrandTwitter size={20} fill="currentColor" stroke={0} />
            </div>
          </div>
        </div>
        <div className="copy-right-statement text-light text-xs-regular py-[10]">
          &copy; 2025 Masz-Africa general mining and services Limited. All
          Rights Reserved
        </div>
      </div>
    </section>
  );
}

export default Footer;
