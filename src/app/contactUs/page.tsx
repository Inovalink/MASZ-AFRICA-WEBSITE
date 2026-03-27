"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  IconUser,
  IconMail,
  IconPhone,
  IconBriefcase,
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconMapPin,
  IconMailFilled,
  IconPhoneFilled,
  IconBrandBehance,
  IconBuilding,
  IconChevronDown,
} from "@tabler/icons-react";
import { Linkedin } from "lucide-react";
import Link from "next/link";
import ScrollReveal from "../components/ScrollReveal";
import LineByLineText from "../components/LineByLineText";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5001';

type ContactType = "individual" | "business";

interface Country {
  name: string;
  dialCode: string;
  code: string;
  flag: string;
}

function CountryCodeDropdown({
  value,
  onChange,
}: {
  value: Country | null;
  onChange: (c: Country) => void;
}) {
  const [open, setOpen] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,idd,cca2,flag")
      .then((r) => r.json())
      .then((data: any[]) => {
        const parsed: Country[] = data
          .filter((c) => c.idd?.root && c.idd?.suffixes?.length === 1)
          .map((c) => ({
            name: c.name.common,
            dialCode: c.idd.root + c.idd.suffixes[0],
            code: c.cca2,
            flag: c.flag,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountries(parsed);
        if (!value) {
          const ghana = parsed.find((c) => c.code === "GH");
          if (ghana) onChange(ghana);
        }
      })
      .catch(() => {
        const fallback = [
          { name: "Ghana", dialCode: "+233", code: "GH", flag: "🇬🇭" },
          { name: "Nigeria", dialCode: "+234", code: "NG", flag: "🇳🇬" },
          { name: "United States", dialCode: "+1", code: "US", flag: "🇺🇸" },
          { name: "United Kingdom", dialCode: "+44", code: "GB", flag: "🇬🇧" },
          { name: "South Africa", dialCode: "+27", code: "ZA", flag: "🇿🇦" },
        ];
        setCountries(fallback);
        if (!value) onChange(fallback[0]);
      });
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = search
    ? countries.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.dialCode.includes(search)
      )
    : countries;

  return (
    <div ref={dropdownRef} className="relative flex-shrink-0">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-[5px] px-[12px] h-full text-sm-medium text-default-body  bg-white"
      >
        <span>{value?.dialCode ?? "+..."}</span>
        <IconChevronDown
          size={13}
          className={`text-[#777777] transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown — styled like the image */}
      {open && (
        <div className="absolute top-full left-0 z-50 w-[240px] bg-white border border-[#E0E0E0] shadow-md max-h-[300px] flex flex-col">
          {/* Search */}
          <div className="px-[12px] py-[9px] border-b border-[#E0E0E0]">
            <input
              autoFocus
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-sm-medium text-default-body placeholder-[#CBCBCB] outline-none bg-transparent"
            />
          </div>
          {/* List */}
          <div className="overflow-y-auto flex-1">
            {filtered.map((country, i) => {
              const isActive = country.code === value?.code;
              return (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => {
                    onChange(country);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`w-full text-left flex items-center gap-[10px] px-[14px] py-[11px] text-sm-medium uppercase tracking-wide transition-colors duration-100
                    ${
                      isActive
                        ? "bg-[#016BF2] text-white"
                        : "text-default-body hover:bg-[#f3f3f3]"
                    }
                    ${
                      i !== filtered.length - 1
                        ? "border-b border-[#E8E8E8]"
                        : ""
                    }`}
                >
                  <span className="text-[14px] leading-none flex-shrink-0">
                    {country.flag}
                  </span>
                  <span className="flex-1 truncate">{country.name}</span>
                  <span
                    className={`text-xs-medium flex-shrink-0 ${
                      isActive ? "text-white/80" : "text-[#AAAAAA]"
                    }`}
                  >
                    {country.dialCode}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ContactPage() {
  const [contactType, setContactType] = useState<ContactType>("individual");
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [locationRevealed, setLocationRevealed] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.email || !formData.message) {
      setSubmitStatus('error');
      setSubmitMessage('Please fill in your name, email, and message.');
      return;
    }
    setIsSubmitting(true);
    setSubmitStatus('idle');
    try {
      const phone = formData.phone ? `${selectedCountry?.dialCode ?? ''}${formData.phone}` : undefined;
      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: phone,
          subject: formData.subject || 'General Inquiry',
          message: formData.message,
          contactingAs: contactType === 'individual' ? 'INDIVIDUAL' : 'BUSINESS',
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message ?? 'Submission failed');
      setSubmitStatus('success');
      setSubmitMessage(json.message ?? "Thank you! We'll get back to you within 24–48 hours.");
      setFormData({ fullName: '', email: '', phone: '', subject: '', message: '' });
    } catch (err: unknown) {
      setSubmitStatus('error');
      setSubmitMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full">
      {/* ── FORM + IMAGE SECTION ── */}
      <div className="contact-top-section mx-[24px] xl:mx-[120px] lg:my-[80px]  my-[42px]">
        <div className="md:flex md:gap-[32px] lg:gap-[60px] xl:gap-[100px] md:items-stretch">
          {/* LEFT — image card (desktop only) */}
          <div className="hidden md:block relative w-1/2  px-[36px] py-[39px]  flex-shrink-0 overflow-hidden">
            <Image
              src="/contactAssets/Image-1.webp"
              alt="Contact information"
              fill
              className="object-cover w-full h-full object-center"
            />
            {/* Dark gradient */}
            <div
              className="absolute inset-0 bg-linear-to-b from-transparent from-35% to-[rgba(0,0,0,0.90)]"
              // style={{
              //   background:
              //     "linear-gradient(to bottom, transparent 35%, rgba(0,0,0,0.88) 100%)",
              // }}
            />
            {/* Overlay text */}
            <div className="absolute max-w-[429px]  bg-white/19  backdrop-blur-xs bottom-[39px] left-5 right-5  lg:left-[36px] lg:right-[36px] py-[22px] px-[28px]">
              <LineByLineText
                startAnimation={true}
                delay={0.2}
                duration={0.3}
                stagger={0.05}
                className="description text-white text-2xl-semibold"
              >
                Contact Information
              </LineByLineText>
              <LineByLineText
                startAnimation={true}
                delay={0.5}
                duration={0.3}
                stagger={0.05}
                className="description text-white text-lg-medium mb-[23px] leading-snug"
              >
                Fill up the form and our team will get back to you within 24
                hours.
              </LineByLineText>
              {/* Social icons */}
              <div className="footer-socials flex items-center py-[] gap-3">
                {/* LinkedIn */}
                <Link
                  href="/"
                  className="relative rounded-full overflow-hidden"
                >
                  <button className="relative cursor-pointer hover:bg-white hover:text-[#016BF2] transition-colors ease-in-out duration-150 bg-[#016BF2] p-[8px] text-white">
                    <Linkedin size={20} fill="currentColor" strokeWidth={0} />{" "}
                  </button>
                </Link>

                {/* Instagram */}
                <Link
                  href="/"
                  className="relative rounded-full overflow-hidden"
                >
                  <button className="relative cursor-pointer hover:bg-white hover:text-[#016BF2] transition-colors ease-in-out duration-150 bg-[#016BF2] p-[8px] text-white">
                    <IconBrandInstagram size={20} />
                  </button>
                </Link>

                {/* Facebook */}
                <Link
                  href="/"
                  className="relative rounded-full overflow-hidden"
                >
                  <button className="relative cursor-pointer hover:bg-white hover:text-[#016BF2] transition-colors ease-in-out duration-150 bg-[#016BF2] p-[8px] text-white">
                    <IconBrandFacebook
                      size={20}
                      fill="currentColor"
                      stroke={0}
                    />{" "}
                  </button>
                </Link>

                {/* Twitter */}
                <Link
                  href="/"
                  className="relative rounded-full overflow-hidden"
                >
                  <button className="relative cursor-pointer hover:bg-white hover:text-[#016BF2] transition-colors ease-in-out duration-150 bg-[#016BF2] p-[8px] text-white">
                    <IconBrandTwitter
                      size={20}
                      fill="currentColor"
                      stroke={0}
                    />
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT — form */}
          <div className="md:w-1/2 h-full my-auto">
            {/* Heading */}
            <div className="mb-[24px] lg:mb-[30px]">
              <LineByLineText
                startAnimation={true}
                delay={0.2}
                duration={0.3}
                stagger={0.05}
                className="text-2xl-semibold lg:text-4xl-semibold leading-[111%] uppercase text-default-heading "
              >
                LET&apos;S GET IN TOUCH
              </LineByLineText>
              <LineByLineText
                startAnimation={true}
                delay={0.5}
                duration={0.3}
                stagger={0.05}
                className="text-sm-medium lg:text-xl-medium text-default-body mt-[11px]"
              >
                Our just reach out manually to{" "}
                <a
                  href="mailto:admin@maszgh.com"
                  className="text-primary-default underline"
                >
                  admin@maszgh.com
                </a>
              </LineByLineText>
            </div>

            {/* Full Name */}
            <div className="input-group mb-[26px]">
              <div className="flex items-center gap-2 border border-[#E0E0E0] px-[14px] lg:px-[22px] py-[12px] lg:py-[17px]">
                <IconUser size={18} className="text-[#777777] flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Full Name*"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full text-sm-medium md:text-md-medium  lg:text-lg-medium text-default-body placeholder-[#CBCBCB] outline-none bg-transparent"
                />
              </div>
            </div>
            <div className="flex gap-[15px] flex-col xl:flex-row mb-[26px]">
              {/* Email */}
              <div className="input-group  flex-1">
                <div className="flex items-center gap-2 border border-[#E0E0E0] px-[14px] lg:px-[22px] py-[12px] lg:py-[17px]">
                  <IconMail
                    size={18}
                    className="text-[#777777] flex-shrink-0"
                  />
                  <input
                    type="email"
                    placeholder="Email*"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className=" w-full text-sm-medium md:text-md-medium  lg:text-lg-medium text-default-body placeholder-[#CBCBCB] outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Phone — with country code */}
              <div className="input-group flex-1">
                <div className="flex items-center border py-[12px] lg:py-[17px] border-[#E0E0E0] overflow-visible relative">
                  <CountryCodeDropdown
                    value={selectedCountry}
                    onChange={setSelectedCountry}
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="flex-1 pr-[12px] w-full text-sm-medium md:text-md-medium lg:text-lg-medium text-default-body placeholder-[#CBCBCB] outline-none bg-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Contacting as */}
            <div className="input-group mb-[26px]">
              <p className="text-sm-medium lg:text-lg-medium text-default-body mb-[21px]">
                Contacting as *
              </p>
              <div className="flex gap-[15px]">
                {/* Individual */}
                <button
                  onClick={() => setContactType("individual")}
                  className={`flex items-center gap-[4px] cursor-pointer text-default-body px-[17px] py-[19px] w-full lg:max-w-[266px] border text-sm-regular transition-colors duration-200 ${
                    contactType === "individual"
                      ? "border-[#016BF2]  "
                      : "border-[#E8E8E8] "
                  }`}
                >
                  <div
                    className={`w-[16px] h-[16px] rounded-full border-1 flex items-center justify-center flex-shrink-0 ${
                      contactType === "individual"
                        ? "border-[#016BF2]"
                        : "border-[#777777]"
                    }`}
                  >
                    {contactType === "individual" && (
                      <div className="w-[6px] h-[6px] rounded-full bg-[#016BF2]" />
                    )}
                  </div>
                  <IconUser size={18} />
                  Individual
                </button>

                {/* Business */}
                <button
                  onClick={() => setContactType("business")}
                  className={`flex items-center cursor-pointer text-default-body px-[17px] py-[19px] w-full lg:max-w-[266px] border text-sm-regular transition-colors duration-200 ${
                    contactType === "business"
                      ? "border-[#016BF2]"
                      : "border-[#E8E8E8]"
                  }`}
                >
                  <div
                    className={`w-[16px] h-[16px]  mr-[8px] rounded-full border flex items-center justify-center flex-shrink-0 ${
                      contactType === "business"
                        ? "border-[#016BF2]"
                        : "border-[#777777]"
                    }`}
                  >
                    {contactType === "business" && (
                      <div className="w-[6px] h-[6px] rounded-full bg-[#016BF2]" />
                    )}
                  </div>
                  <IconBuilding className=" mr-1" size={18} />
                  Business
                </button>
              </div>
            </div>

            {/* Subject */}
            <div className="input-group mb-[26px]">
              <div className="flex items-center gap-[10px] border border-[#D5D7DA] px-[24px] py-[17px] ">
                <input
                  type="text"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full text-sm-medium md:text-md-medium lg:text-lg-medium text-default-body placeholder-[#CBCBCB] outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Message */}
            <div className="input-group  mb-[17px]">
              <div className="border border-[#D5D7DA] px-[14px] py-[10px] ">
                <textarea
                  placeholder="Type your message..."
                  maxLength={300}
                  rows={5}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full text-sm-medium md:text-md-medium lg:text-lg-medium text-default-body placeholder-[#CBCBCB] outline-none bg-transparent resize-none"
                />
                {/* Character hint bottom right */}
                <div className="flex justify-end">
                  <span className="text-[11px] text-[#CBCBCB]">
                    {formData.message.length}/300
                  </span>
                </div>
              </div>
            </div>

            {/* Status message */}
            {submitStatus !== 'idle' && (
              <div className={`mb-[14px] px-[14px] py-[12px] text-sm-medium ${submitStatus === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {submitMessage}
              </div>
            )}

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-primary-default text-white text-sm-medium lg:text-md-medium py-[14px] lg:py-[19px] uppercase tracking-wider bg-[#016BF2] transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
            </button>
          </div>
        </div>
      </div>

     {/* ── MAP + LOCATION SECTION ── */}
     <ScrollReveal
        direction="up"
        duration={0.4}
        start="top 90%"
        scale
        once
        staggerChildren={0.1}
        onRevealNearlyComplete={() => setLocationRevealed(true)}
      >
        <div id="talk-to-us" className="contact-bottom-section relative bg-[#016BF2] overflow-hidden mt-[60px] lg:mt-[100px]">
          {/* SVG dot pattern background */}
          <Image src="/contactBg.svg" alt="Background pattern" width={456} height={670} className=" hidden lg:block absolute right-0" />

          <div className="relative z-10 mx-[24px] xl:mx-[120px] min-[1920px]:mx-[200px] py-[40px] lg:py-[60px]">
            {/* Mobile/Tablet: map on top (below lg) */}
            <div className="lg:hidden w-full h-[280px] overflow-hidden mb-[32px]">
              <iframe
                title="MASZ Africa Head Office"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.7!2d-1.9947!3d5.3054!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMTgnMTkuNCJOIDHCsDU5JzQxLjAiVw!5e0!3m2!1sen!2sgh!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="flex flex-col lg:flex-row lg:gap-[40px] xl:gap-[60px] lg:items-stretch">
              {/* LEFT — heading + cards */}
              <div className="flex-shrink-0 lg:w-[458px]">
                <LineByLineText
                  startAnimation={locationRevealed}
                  delay={0.5}
                  duration={0.35}
                  stagger={0.07}
                  className="text-2xl-regular text-[#8DBCF9] md:text-3xl-medium lg:text-4xl-medium   leading-tight mb-[32px] lg:mb-[67px]"
                >
                  We Are Based In
                  <br />
                  <span className="font-medium text-white">
                    Western Region,
                    <br />
                    Ghana
                  </span>
                </LineByLineText>

                <div className="flex flex-col gap-[12px] lg:gap-[14px]">
                  {/* Street address */}
                  <div className="flex items-center cursor-pointer lg:max-w-[363px] group transition-colors duration-200 ease-in-out hover:bg-white focus:bg-white gap-[14px] bg-[#4693F6] px-[20px] lg:px-[24px] py-[16px] lg:py-[20px]">
                    <div className="flex-shrink-0 w-[36px] group-hover:bg-[#016BF2] group-focus:bg-[#016BF2] h-[36px] rounded-full bg-white flex items-center justify-center">
                      <IconMapPin size={16} className="text-[#016BF2] group-hover:text-white group-focus:text-white" />
                    </div>
                    <LineByLineText
                      startAnimation={locationRevealed}
                      delay={0.7}
                      duration={0.3}
                      stagger={0.06}
                      className="text-sm-medium md:text-md-medium lg:text-lg-medium text-white group-hover:text-[#016BF2] group-focus:text-[#016BF2] leading-snug"
                    >
                      House #17, Breeze Street,
                      <br />
                      GT 353-5495, Community 16, Terno
                    </LineByLineText>
                  </div>

                  {/* PO Box */}
                  <div className="flex items-center lg:max-w-[363px] group cursor-pointer transition-colors duration-200 ease-in-out hover:bg-white focus:bg-white gap-[14px] bg-[#4693F6] px-[20px] lg:px-[24px] py-[16px] lg:py-[20px]">
                    <div className="flex-shrink-0 w-[36px] group-hover:bg-[#016BF2] h-[36px] rounded-full bg-white flex items-center justify-center">
                      <IconMail size={16} className="text-[#016BF2] group-hover:text-white group-focus:text-white" />
                    </div>
                    <LineByLineText
                      startAnimation={locationRevealed}
                      delay={0.7}
                      duration={0.3}
                      stagger={0.06}
                      className="text-sm-medium md:text-md-medium lg:text-lg-medium text-white group-hover:text-[#016BF2] group-focus:text-[#016BF2] leading-snug"
                    >
                      P.O. Box 729, Tarkwa,
                      <br />
                      Western Region, Ghana
                    </LineByLineText>
                  </div>

                  {/* Phone numbers */}
                  <div className="flex items-center lg:max-w-[363px] group cursor-pointer transition-colors duration-200 ease-in-out hover:bg-white focus:bg-white gap-[14px] bg-[#4693F6] px-[20px] lg:px-[24px] py-[16px] lg:py-[20px]">
                    <div className="flex-shrink-0 w-[36px] group-hover:bg-[#016BF2] h-[36px] rounded-full bg-white flex items-center justify-center">
                      <IconPhone size={16} className="text-[#016BF2] group-hover:text-white group-focus:text-white" />
                    </div>
                    <div className="flex flex-col gap-[2px]">
                      <LineByLineText
                        startAnimation={locationRevealed}
                        delay={0.7}
                        duration={0.3}
                        stagger={0.06}
                        className="text-sm-medium text-white flex flex-col md:text-md-medium lg:text-lg-medium"
                      >
                        <Link href="tel:+233244163975" className="group-hover:text-[#016BF2] group-focus:text-[#016BF2] hover:underline block">
                          +233 24 416 3975
                        </Link>
                   
                        <Link href="tel:+233540953033" className="group-hover:text-[#016BF2] group-focus:text-[#016BF2] hover:underline block">
                          +233 54 095 3033
                        </Link>
                      </LineByLineText>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT — Google Map (desktop only, lg+) */}
              <div className="hidden lg:block flex-1 min-h-[400px] overflow-hidden">
                <iframe
                  title="MASZ Africa Head Office"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.7!2d-1.9947!3d5.3054!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMTgnMTkuNCJOIDHCsDU5JzQxLjAiVw!5e0!3m2!1sen!2sgh!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );

}
