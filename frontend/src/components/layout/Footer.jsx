import React from "react";

function Footer() {
  return (
    <div>
      <footer className="footer footer-horizontal footer-center bg-base-200 text-base-content rounded p-10">
        {/* Navigation Links */}
        <nav className="grid grid-flow-col gap-4">
          <a className="link link-hover">About GreenHub</a>
          <a className="link link-hover">Shop Plants</a>
          <a className="link link-hover">Plant Care Tips</a>
          <a className="link link-hover">Contact Us</a>
        </nav>

        {/* Social Icons */}
        <nav>
          <div className="grid grid-flow-col gap-4">
            {/* Instagram */}
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path
                  d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 
                0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2a3 3 
                0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 
                3 0 0 1 3-3h10zm-5 3a5 5 0 1 0 0 10 5 5 0 0 
                0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 
                0-6zm4.5-.75a1.25 1.25 0 1 1 0 2.5 1.25 
                1.25 0 0 1 0-2.5z"
                />
              </svg>
            </a>

            {/* YouTube */}
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path
                  d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 
                0-3.897.266-4.356 2.62-4.385 8.816.029 
                6.185.484 8.549 4.385 8.816 3.6.245 
                11.626.246 15.23 0 3.897-.266 
                4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 
                12.816v-8l8 3.993-8 4.007z"
                />
              </svg>
            </a>

            {/* Facebook */}
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path
                  d="M9 8H6v4h3v12h5V12h3.642l.358-4h-4V6.333C14 
                5.378 14.192 5 15.115 5h2.885V0h-3.808C10.596 
                0 9 1.583 9 4.615V8z"
                />
              </svg>
            </a>
          </div>
        </nav>

        {/* Copyright */}
        <aside>
          <p>
            Copyright © {new Date().getFullYear()} — All rights reserved by{" "}
            <span className="font-semibold">GreenHub</span>.
          </p>
        </aside>
      </footer>
    </div>
  );
}

export default Footer;
