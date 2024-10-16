import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/components/_footer.scss";

const Footer: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const renderFooterSection = (
    title: string,
    links: { to: string; text: string }[]
  ) => (
    <div className="footer__section">
      <h3
        className="footer__section-title"
        onClick={() => toggleSection(title)}
      >
        {title}{" "}
        <span className="footer__arrow">
          {expandedSections.includes(title) ? "▲" : "▼"}
        </span>
      </h3>
      <ul
        className={`footer__list ${
          expandedSections.includes(title) ? "footer__list--expanded" : ""
        }`}
      >
        {links.map((link, index) => (
          <li key={index}>
            <Link to={link.to} className="footer__link">
              {link.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__content">
          <div className="footer__section footer__section--newsletter">
            <h3 className="footer__section-title">
              Subscribe to our Newsletter
            </h3>
            <form className="footer__newsletter">
              <input
                type="email"
                placeholder="Enter your email"
                className="footer__input"
              />
              <button type="submit" className="footer__button">
                Subscribe
              </button>
            </form>
          </div>

          {renderFooterSection("About", [
            { to: "/explore", text: "Explore" },
            { to: "/drops", text: "Drops" },
            { to: "/collect", text: "Collect" },
          ])}

          {renderFooterSection("My account", [
            { to: "/dashboard", text: "Dashboard" },
            { to: "/watchlist", text: "Watchlist" },
            { to: "/settings", text: "Settings" },
          ])}

          {renderFooterSection("Create", [
            { to: "/become-creator", text: "Become a creator" },
            { to: "/create-collection", text: "Create collection" },
          ])}

          {renderFooterSection("Join us", [
            { to: "https://twitter.com", text: "X Platform" },
            { to: "https://t.me", text: "Telegram" },
            { to: "https://discord.com", text: "Discord" },
          ])}
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            Copyright © {new Date().getFullYear()} FinityOne NFT
          </p>
          <nav className="footer__legal">
            <Link to="/whitepaper" className="footer__legal-link">
              Whitepaper
            </Link>
            <Link to="/privacy-policy" className="footer__legal-link">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="footer__legal-link">
              Terms of Service
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
