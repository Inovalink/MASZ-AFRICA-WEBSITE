"use client";

import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ChevronRight, MoveRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

export const serviceDropdownItems = [
  { id: "s1", label: "Grinding Media", slug: "grinding-media" },
  { id: "s2", label: "Activated Carbon", slug: "activated-carbon" },
  { id: "s3", label: "Metal & Steel Pipes", slug: "metal-and-steel-pipes" },
  {
    id: "s4",
    label: "Gearbox Servicing & Heavy Equipment Maintenance",
    slug: "gear-box-servicing-and-heavy-equipment-maintenance",
  },
  {
    id: "s5",
    label: "Crusher Seals Installation and Equipment Protection",
    slug: "crusher-seals-installation-and-equipment-protection",
  },
  {
    id: "s6",
    label: "Procurement and Supply Chain Management",
    slug: "procurement-and-supply-chain-management",
  },
  {
    id: "s7",
    label: "Technical Consultancy and Field Support",
    slug: "technical-consultancy-and-field-support",
  },
];

export const navLinks = [
  { id: "1", label: "home", path: "/", hasSubmenu: false },
  { id: "2", label: "about", path: "/aboutUs", hasSubmenu: false },
  {
    id: "3",
    label: "services",
    path: "/services",
    hasSubmenu: true,
    submenuItems: serviceDropdownItems,
  },
  // { id: "4", label: "careers", path: "/careers", hasSubmenu: false },
];

const mobileNavLinks = [
  ...navLinks,
  { id: "5", label: "contact us", path: "/contactUs", hasSubmenu: false },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesExpanded, setServicesExpanded] = useState(false);
  const [mobileMenuAnimCycle, setMobileMenuAnimCycle] = useState(0);
  const prevMenuOpenRef = useRef(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const menuIconRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const isExpandedRef = useRef(false);

  const pathname = usePathname();

  const SCROLL_RANGE_PX = 200;

  useEffect(() => {
    if (!menuOpen) {
      setServicesExpanded(false);
    }
    if (menuOpen && !prevMenuOpenRef.current) {
      setMobileMenuAnimCycle((c) => c + 1);
    }
    prevMenuOpenRef.current = menuOpen;
  }, [menuOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const html = document.documentElement;
    const body = document.body;

    const releaseLock = () => {
      html.style.overflow = "";
      body.style.overflow = "";
      body.style.overscrollBehavior = "";
    };

    const sync = () => {
      if (menuOpen && window.innerWidth < 1280) {
        html.style.overflow = "hidden";
        body.style.overflow = "hidden";
        body.style.overscrollBehavior = "none";
      } else {
        releaseLock();
      }
    };

    sync();
    window.addEventListener("resize", sync);

    return () => {
      window.removeEventListener("resize", sync);
      releaseLock();
    };
  }, [menuOpen]);

  const updateMenuOrigin = () => {
    const btn = menuIconRef.current;
    const panel = menuPanelRef.current;
    if (!btn || !panel) return;

    const btnRect = btn.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    const originX = btnRect.left + btnRect.width / 2 - panelRect.left;
    const originY = btnRect.top + btnRect.height / 2 - panelRect.top;

    panel.style.setProperty("--menu-origin-x", `${originX}px`);
    panel.style.setProperty("--menu-origin-y", `${originY}px`);
  };

  useLayoutEffect(() => {
    if (typeof window === "undefined" || window.innerWidth >= 1280) return;
    updateMenuOrigin();
  }, [menuOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onResize = () => {
      if (window.innerWidth >= 1280) return;
      updateMenuOrigin();
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const header = headerRef.current;
    const inner = innerRef.current;
    if (!header || !inner) return;

    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      mm.add("(min-width: 1919px)", () => {
        gsap.set(header, {
          width: "calc(100% - 400px)",
          left: "200px",
          y: "0",
          backgroundColor: "#ffffff",
          backdropFilter: "blur(0px)",
        });
        gsap.set(inner, { marginLeft: "0rem", marginRight: "0rem" });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: `${SCROLL_RANGE_PX}px top`,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const shouldBeExpanded = self.progress > 0.4;
              if (shouldBeExpanded !== isExpandedRef.current) {
                isExpandedRef.current = shouldBeExpanded;
                header.classList.toggle("navbar--expanded", shouldBeExpanded);
                setIsScrolled(shouldBeExpanded);
              }
            },
          },
        });

        tl.to(
          header,
          {
            width: "100%",
            left: "0%",
            y: 0,
            backgroundColor: "rgba(13, 13, 13, 0.94)",
            backdropFilter: "blur(14px)",
            ease: "none",
            duration: 1,
            force3D: true,
          },
          0
        );
        tl.to(
          inner,
          {
            marginLeft: "7.5rem",
            marginRight: "7.5rem",
            ease: "none",
            duration: 1,
            force3D: true,
          },
          0
        );
      });

      mm.add("(min-width: 1280px) and (max-width: 1919px)", () => {
        gsap.set(header, {
          width: "calc(100% - 240px)",
          left: "120px",
          y: "0",
          backgroundColor: "#ffffff",
          backdropFilter: "blur(0px)",
        });
        gsap.set(inner, { marginLeft: "0rem", marginRight: "0rem" });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: `${SCROLL_RANGE_PX}px top`,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const shouldBeExpanded = self.progress > 0.4;
              if (shouldBeExpanded !== isExpandedRef.current) {
                isExpandedRef.current = shouldBeExpanded;
                header.classList.toggle("navbar--expanded", shouldBeExpanded);
                setIsScrolled(shouldBeExpanded);
              }
            },
          },
        });

        tl.to(
          header,
          {
            width: "100%",
            left: "0%",
            y: 0,
            backgroundColor: "rgba(13, 13, 13, 0.94)",
            backdropFilter: "blur(14px)",
            ease: "none",
            duration: 1,
            force3D: true,
          },
          0
        );
        tl.to(
          inner,
          {
            marginLeft: "5.5rem",
            marginRight: "5.5rem",
            ease: "none",
            duration: 1,
            force3D: true,
          },
          0
        );
      });

      mm.add("(max-width: 1279px)", () => {
        gsap.set(header, {
          width: "100%",
          left: "0%",
          y: 0,
          backgroundColor: "#ffffff",
          backdropFilter: "blur(0px)",
        });
        gsap.set(inner, { marginLeft: "1.5rem", marginRight: "1.5rem" });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: document.body,
              onUpdate: (self) => {
                const shouldBeExpanded = self.progress > 0.4;
                if (shouldBeExpanded !== isExpandedRef.current) {
                  isExpandedRef.current = shouldBeExpanded;
                  setIsScrolled(shouldBeExpanded);
                }
              },
              start: "top top",
              end: `${SCROLL_RANGE_PX}px top`,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          })
          .to(
            header,
            {
              backgroundColor: "rgba(13, 13, 13, 0.94)",
              backdropFilter: "blur(14px)",
              ease: "none",
              duration: 1,
              force3D: true,
            },
            0
          );
      });
    }, header);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, []);

  const isLinkActive = (link: {
    path: string;
    hasSubmenu?: boolean;
    label?: string;
  }) => {
    if (link.hasSubmenu) {
      return pathname === link.path || pathname?.startsWith(`${link.path}/`);
    }
    return pathname === link.path;
  };

  const navActiveMobileRow =
    "bg-blue-50 text-blue-700 font-semibold tracking-[-0.03em] rounded-lg px-3.5";
  const navInactiveMobileRow =
    "text-neutral-500 font-normal tracking-[-0.03em] px-3.5";

  return (
    <>
      <button
        type="button"
        aria-label="Close menu"
        aria-hidden={!menuOpen}
        tabIndex={menuOpen ? 0 : -1}
        className={`mobile-menu-backdrop fixed inset-0 z-[90] h-dvh w-full lg:hidden bg-neutral-950/45 backdrop-blur-md ${
          menuOpen ? "mobile-menu-backdrop--open" : "mobile-menu-backdrop--closed"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      <div className="h-[90px]" />

      <header
        ref={headerRef}
        className="navbar navbar--compact fixed top-0 z-[100] h-[90px] will-change-transform"
        style={{
          width: "100%",
          left: "0",
          backgroundColor: "#ffffff",
        }}
      >
        <div
          ref={innerRef}
          className="main-nav-container flex justify-between items-center h-full"
        >
          <Link href="/" aria-label="MASZ Africa — Home" className="nav-logo shrink-0">
            <Image
              src={
                isScrolled ? "/maszAssets/logo-white.svg" : "/maszAssets/website-logo.svg"
              }
              width={140}
              height={50}
              alt="masz africa logo"
              style={{ height: 25, width: "auto" }}
            />
          </Link>

          <div className="nav-list flex items-center">
            <div className="hidden lg:flex mr-[50px] p-[20px] text-default-body">
              <ul className="flex gap-8 uppercase items-center text-md-medium">
                {navLinks.map((list) => {
                  const isActive = isLinkActive(list);

                  return (
                    <li key={list.id} className="relative group">
                      <Link
                        href={list.path}
                        className={`
                          relative inline-flex gap-2 items-center px-1 py-1 font-medium 
                          before:content-[''] before:absolute before:left-0 before:top-[-10px]
                          before:h-[4px] before:w-0 before:bg-blue-500
                          before:transition-[width,opacity] before:duration-300 before:opacity-0
                          after:content-[''] after:absolute after:left-0 after:bottom-[-10px]
                          after:h-[4px] after:w-0 after:bg-blue-500
                          after:transition-[width,opacity] after:duration-300 after:opacity-0
                          hover:before:w-full hover:after:w-full hover:before:opacity-100 hover:after:opacity-100
                          ${
                            isActive
                              ? `before:w-full after:w-full before:opacity-100 after:opacity-100 ${isScrolled ? `text-white` : `text-primary-default`}`
                              : "text-default-body"
                          }
                        `}
                      >
                        {list.label}
                        {list.hasSubmenu && (
                          <ChevronDown className="size-4 transition-transform duration-300 group-hover:rotate-180" />
                        )}
                      </Link>

                      {list.hasSubmenu && list.submenuItems && (
                        <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                          <div className="bg-black/89 backdrop-blur-sm w-65 flex flex-col gap-2 flex-1 py-3 px-2.5 dropdown-enter">
                            {list.submenuItems.map((item) => (
                              <Link
                                key={item.id}
                                href={`/services/${item.slug}`}
                                className={`
                                  block px-4 py-2 text-[15.4px] font-medium uppercase leading-[140%]
                                  transition-all duration-200
                                  ${
                                    pathname === `/services/${item.slug}`
                                      ? "bg-blue-500 text-white"
                                      : "text-[#CBCBCB] hover:bg-blue-500 hover:text-white"
                                  }
                                `}
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="contact-us-cta hidden lg:flex justify-between items-center mr-[10px]">
              <Link
                href="/contactUs"
                className="font-medium bg-transparent border-[1.5px] border-button-primary-default text-button-primary-default px-[8px] py-[7px] flex"
              >
                Contact Us
                <MoveRight size={20} className="mt-[2px] ml-2" />
              </Link>
            </div>

            <button
              ref={menuIconRef}
              type="button"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="menu-icon relative z-[101] ml-2 w-[30px] h-[30px] flex flex-col justify-center items-center gap-[4px] cursor-pointer lg:hidden"
              onClick={() => {
                if (!menuOpen) updateMenuOrigin();
                setMenuOpen((open) => !open);
              }}
            >
              <span
                className={`block h-[3px] w-full rounded transition-all duration-500 ${
                  isScrolled ? "bg-white" : "bg-black"
                } ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
              />
              <span
                className={`block h-[3px] w-full rounded transition-all duration-500 ${
                  isScrolled ? "bg-white" : "bg-black"
                } ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-[3px] w-full rounded transition-all duration-500 ${
                  isScrolled ? "bg-white" : "bg-black"
                } ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
              />
            </button>
          </div>
        </div>

        <div
          ref={menuPanelRef}
          className={`mobile-menu-panel mobile_navItems fixed z-[95] top-[90px] left-0 right-0 flex h-[calc(100dvh-90px)] flex-col overflow-hidden rounded-b-2xl bg-white lg:hidden ${
            menuOpen ? "mobile-menu-panel--open" : ""
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="mobile-menu-panel__content flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain pb-[max(1.25rem,env(safe-area-inset-bottom))] [scrollbar-width:thin] [-webkit-overflow-scrolling:touch] [scrollbar-color:rgba(115,115,115,0.25)_transparent]"
          >
            <div
              key={mobileMenuAnimCycle}
              className="mx-auto flex w-[90%] max-w-full flex-col px-2 pt-4"
            >
              {mobileNavLinks.map((link, index) => {
                const staggerMs = 90;
                const baseDelay = 60;
                const rowDelay = menuOpen ? baseDelay + index * staggerMs : 0;
                const rowActive = isLinkActive(link);
                const rowText = rowActive ? navActiveMobileRow : navInactiveMobileRow;
                const rowPad = "py-[1.1rem]";
                const divider = "border-b border-neutral-100";
                const isLastLink = link.label === "contact us";

                return (
                  <div key={link.id}>
                    {link.hasSubmenu ? (
                      <>
                        <div
                          className={`mobile-nav-link-enter flex items-center justify-between gap-3 text-xl leading-snug capitalize ${rowPad} ${divider} ${rowText}`}
                          style={{ animationDelay: `${rowDelay}ms` }}
                        >
                          <Link
                            href={link.path}
                            onClick={() => {
                              setMenuOpen(false);
                              setServicesExpanded(false);
                            }}
                            className="min-w-0 flex-1 outline-none focus-visible:ring-2 focus-visible:ring-blue-300/80 focus-visible:ring-inset focus-visible:rounded-lg"
                          >
                            {link.label}
                          </Link>
                          <button
                            type="button"
                            aria-expanded={servicesExpanded}
                            aria-label="Toggle services menu"
                            onClick={() => setServicesExpanded((v) => !v)}
                            className="nav-icon-wiggle inline-flex shrink-0 cursor-pointer p-1 -mr-1"
                          >
                            <ChevronDown
                              className={`size-4.5 transition-transform duration-300 ease-out ${rowActive ? "text-blue-600" : "text-neutral-600"} ${servicesExpanded ? "rotate-180" : ""}`}
                              strokeWidth={rowActive ? 3 : 2.5}
                            />
                          </button>
                        </div>

                        <div
                          className={`overflow-hidden transition-all duration-500 ease-in-out ${
                            servicesExpanded
                              ? "max-h-[800px] opacity-100 mt-2"
                              : "max-h-0 opacity-0 mt-0"
                          }`}
                        >
                          <div className="overflow-hidden rounded-lg bg-neutral-100 py-2">
                            {link.submenuItems?.map((item, subIndex) => {
                              const subActive =
                                pathname === `/services/${item.slug}` ||
                                pathname?.startsWith(`/services/${item.slug}/`);

                              return (
                                <Link
                                  key={item.id}
                                  href={`/services/${item.slug}`}
                                  onClick={() => {
                                    setMenuOpen(false);
                                    setServicesExpanded(false);
                                  }}
                                  className={`mobile-nav-link-enter block px-[30px] py-[14px] text-md-medium uppercase transition-all duration-200 ${
                                    subActive
                                      ? "bg-blue-500 text-white"
                                      : "text-neutral-700 hover:bg-blue-500 hover:text-white active:bg-blue-500 active:text-white"
                                  }`}
                                  style={{
                                    animationDelay: `${baseDelay + index * staggerMs + 40 + subIndex * 55}ms`,
                                  }}
                                >
                                  <div className="flex justify-between items-center gap-3">
                                    <span>{item.label}</span>
                                    <ChevronRight size={18} />
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    ) : (
                      <Link
                        href={link.path}
                        onClick={() => setMenuOpen(false)}
                        className={`mobile-nav-link-enter flex w-full min-w-0 items-center justify-between gap-3 text-left text-xl leading-snug capitalize ${rowPad} ${rowText} ${isLastLink ? "border-b-0" : divider} outline-none focus-visible:ring-2 focus-visible:ring-blue-300/80 focus-visible:ring-inset focus-visible:rounded-lg`}
                        style={{ animationDelay: `${rowDelay}ms` }}
                      >
                        <span className="min-w-0">{link.label}</span>
                        <span
                          className="nav-icon-wiggle inline-flex shrink-0 text-current"
                          aria-hidden
                        >
                          <MoveRight
                            className={`size-4.5 ${rowActive ? "text-blue-600" : "text-neutral-600"}`}
                            strokeWidth={rowActive ? 2.5 : 2}
                          />
                        </span>
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;
