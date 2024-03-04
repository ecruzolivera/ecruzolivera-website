import React from "react";
import Link from "next/link";
import Db from "@/lib/db.json";

export default function Header() {
  const socialLinks = Db.social;
  return (
    <div className="flex justify-between max-w-2xl mx-auto my-4">
      <ul className="flex">
        <li>
          <Link
            href="/"
            className="px-2 pb-1 mx-1 text-primary border-b-2 border-bg-primary hover:border-secondary"
          >
            Me
          </Link>
        </li>
        <li>
          <Link
            href="/blog"
            className="px-2 pb-1 mx-1 text-primary border-b-2 border-bg-primary hover:border-secondary"
          >
            Blog
          </Link>
        </li>
        <li>
          <Link
            href="/cv"
            className="px-2 pb-1 mx-1 text-primary border-b-2 border-bg-primary hover:border-secondary"
          >
            CV
          </Link>
        </li>
      </ul>
      <ul className="flex">
        {socialLinks.map((link) => (
          <li key={link.to}>
            <a
              href={link.to}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="text-lg px-2 pb-1 mx-1 text-primary border-b-2 border-bg-primary hover:border-secondary"
            >
              <i className={link.icon} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
