import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import WalletButton from "../WalletButton";
import {
  FaSearch,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaShoppingCart,
} from "react-icons/fa";
import "../../styles/components/_header.scss";
import finityOneLogo from "../../assets/finityOne-logo.png";

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path: string) => location.pathname === path;

  const renderNavItems = () => (
    <>
      <Link
        to="/"
        className={`header__nav-link ${isActive("/") ? "active" : ""}`}
      >
        Home
      </Link>
      <div
        className="header__nav-item"
        onMouseEnter={() => setExploreOpen(true)}
        onMouseLeave={() => setExploreOpen(false)}
      >
        <span className="header__nav-link">
          Explore <FaChevronDown />
        </span>
        {exploreOpen && (
          <div className="header__dropdown">
            <Link to="/explore" className="header__dropdown-item">
              Explore NFTs
            </Link>
            <Link to="/collections" className="header__dropdown-item">
              Collections
            </Link>
            <Link to="/activity" className="header__dropdown-item">
              Activity
            </Link>
          </div>
        )}
      </div>
      <div
        className="header__nav-item"
        onMouseEnter={() => setCreateOpen(true)}
        onMouseLeave={() => setCreateOpen(false)}
      >
        <span className="header__nav-link">
          Create <FaChevronDown />
        </span>
        {createOpen && (
          <div className="header__dropdown">
            <Link to="/create" className="header__dropdown-item">
              Create Collection
            </Link>
            <Link to="/mint" className="header__dropdown-item">
              Mint NFT
            </Link>
          </div>
        )}
      </div>
      <Link
        to="/profile"
        className={`header__nav-link ${isActive("/profile") ? "active" : ""}`}
      >
        Profile
      </Link>
    </>
  );

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo">
          <img
            src={finityOneLogo}
            alt="FinityONE Logo"
            className="header__logo-image"
          />
        </Link>
        {isMobile ? (
          <button
            className="header__mobile-menu-button"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        ) : (
          <nav className="header__nav">{renderNavItems()}</nav>
        )}
        <div className="header__actions">
          <div className="header__search-container">
            <FaSearch className="header__search-icon" />
            <input
              type="search"
              placeholder="Search Collections, NFTs, Users..."
              className="header__search"
            />
          </div>
          <Link to="/cart" className="header__cart-icon">
            <FaShoppingCart />
          </Link>
          <WalletButton />
        </div>
      </div>
      {isMobile && mobileMenuOpen && (
        <nav className="header__mobile-nav">{renderNavItems()}</nav>
      )}
    </header>
  );
};

export default Header;
