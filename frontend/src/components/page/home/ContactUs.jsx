import React from "react";

function ContactUs() {
  return (
    <section className="hero bg-base-200 min-h-screen px-4 sm:px-6">
      <div className="hero-content flex-col lg:flex-row-reverse gap-10">
        {/* TEXT CONTENT */}
        <div className="text-center lg:text-left max-w-xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            Contact GreenHub
          </h1>

          <p className="py-4 sm:py-6 opacity-80 text-sm sm:text-base">
            Have questions about our plants, orders, or services? We’re here to
            help you bring more greenery into your life. Feel free to reach out
            using the details below.
          </p>
        </div>

        {/* CONTACT INFO CARD */}
        <div className="card bg-base-100 w-full max-w-md shadow-2xl">
          <div className="card-body space-y-5 text-center sm:text-left">
            <div>
              <h2 className="font-semibold text-base sm:text-lg">Email</h2>
              <p className="opacity-80 break-all">support@greenhub.com</p>
            </div>

            <div>
              <h2 className="font-semibold text-base sm:text-lg">Phone</h2>
              <p className="opacity-80">+91 98765 43210</p>
            </div>

            <div>
              <h2 className="font-semibold text-base sm:text-lg">Address</h2>
              <p className="opacity-80">
                GreenHub Garden Center,
                <br />
                Sector 13A, India
              </p>
            </div>

            <div>
              <h2 className="font-semibold text-base sm:text-lg">
                Working Hours
              </h2>
              <p className="opacity-80">Mon – Sat: 9:00 AM – 7:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactUs;
