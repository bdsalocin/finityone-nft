import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

test("renders header", () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const headerElement = screen.getByRole("banner");
  expect(headerElement).toBeInTheDocument();
});

test("renders main navigation links", () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const homeLink = screen.getByText(/home/i);
  const exploreLink = screen.getByText(/explore/i);
  const createLink = screen.getByText(/create/i);
  const profileLink = screen.getByText(/profile/i);
  expect(homeLink).toBeInTheDocument();
  expect(exploreLink).toBeInTheDocument();
  expect(createLink).toBeInTheDocument();
  expect(profileLink).toBeInTheDocument();
});
