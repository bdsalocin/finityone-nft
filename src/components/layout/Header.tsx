import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Menu, X, ChevronDown, ShoppingCart } from "lucide-react";
import WalletButton from "../WalletButton";

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  const navigationItems = [
    {
      id: "explore",
      label: "Explore",
      dropdown: [
        { label: "All NFTs", href: "/explore" },
        { label: "Collections", href: "/collections" },
        { label: "Activity", href: "/activity" },
      ],
    },
    {
      id: "create",
      label: "Create",
      dropdown: [
        { label: "Single NFT", href: "/create" },
        { label: "Collection", href: "/create-collection" },
      ],
    },
  ];

  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }

    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [mobileMenuOpen]);

  const handleDropdownToggle = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const handleMobileMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <header className="header">
      <div className="header__container">
        {/* Logo */}
        <Link to="/" className="header__logo">
          <span className="header__logo-text">FinityONE</span>
        </Link>

        {/* Navigation principale */}
        <nav
          className={`header__nav ${mobileMenuOpen ? "active" : ""}`}
          onClick={handleNavClick}
        >
          <ul className="header__nav-list">
            {navigationItems.map((item) => (
              <li key={item.id} className="header__nav-item">
                <button
                  className="header__nav-button"
                  onClick={() => handleDropdownToggle(item.id)}
                >
                  {item.label}
                  <ChevronDown
                    style={{
                      transform:
                        activeDropdown === item.id ? "rotate(180deg)" : "none",
                      transition: "transform 0.3s ease",
                    }}
                  />
                </button>

                {activeDropdown === item.id && (
                  <div className="header__dropdown">
                    {item.dropdown.map((dropItem) => (
                      <Link
                        key={dropItem.href}
                        to={dropItem.href}
                        className="header__dropdown-link"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {dropItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Actions mobiles */}
          <div className="header__mobile-actions">
            <Link to="/cart" className="header__action-button">
              <ShoppingCart />
            </Link>
            <WalletButton />
          </div>
        </nav>

        {/* Actions */}
        <div className="header__actions">
          <button className="header__action-button">
            <Search />
          </button>
          <Link to="/cart" className="header__action-button hide-mobile">
            <ShoppingCart />
          </Link>
          <div className="hide-mobile">
            <WalletButton />
          </div>
          <button
            className={`header__menu-button ${mobileMenuOpen ? "active" : ""}`}
            onClick={handleMobileMenuClick}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Backdrop pour le menu mobile */}
      {mobileMenuOpen && (
        <div
          className="mobile-menu-backdrop active"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;
