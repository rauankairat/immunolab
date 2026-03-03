"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function LanguageSelector({ current }: { current: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(current);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const languages = [
    { code: "en", name: "English" },
    { code: "ru", name: "Русский" },
    { code: "kk", name: "Қазақша" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSelect(code: string) {
    setSelectedLang(code);
    setIsOpen(false);

    await fetch("/api/locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: code }),
    });

    startTransition(() => {
      router.refresh();
    });
  }

  const currentLang = languages.find((lang) => lang.code === selectedLang);

  return (
    <div className="language-dropdown" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="language-selector"
        aria-expanded={isOpen}
        disabled={isPending}
      >
        {currentLang?.name}
        <svg
          className={`dropdown-arrow ${isOpen ? "open" : ""}`}
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
        >
          <path
            d="M1 1.5L6 6.5L11 1.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <ul className="language-dropdown-menu">
          {languages.map((lang) => (
            <li key={lang.code}>
              <button
                onClick={() => handleSelect(lang.code)}
                className={`language-option ${selectedLang === lang.code ? "selected" : ""}`}
              >
                {selectedLang === lang.code && (
                  <svg
                    className="check-icon"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M13.3333 4L6 11.3333L2.66667 8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                <span>{lang.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}