"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./page.module.css";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Person {
  name: string;
  role: string;
  // Replace with real image paths, e.g. "/team/dr-smith.jpg"
  // Use null to show the placeholder silhouette
  image: string | null;
}

// ─── Team data ────────────────────────────────────────────────────────────────

const medicalTeam: Person[] = [
  { name: "Dr. [Name]",        role: "Allergist / Immunologist",          image: null },
  { name: "Dr. [Name]",        role: "Allergist / Immunologist",          image: null },
  { name: "Dr. [Name]",        role: "Paediatric Allergist",              image: null },
  { name: "Dr. [Name]",        role: "Paediatric Allergist",              image: null },
  { name: "[Name]",            role: "Senior Lab Technician",             image: null },
  { name: "[Name]",            role: "Lab Technician",                    image: null },
  { name: "[Name]",            role: "Lab Technician",                    image: null },
  { name: "[Name]",            role: "Nurse / Sample Collection",         image: null },
  { name: "[Name]",            role: "Nurse / Sample Collection",         image: null },
  { name: "[Name]",            role: "Patient Coordinator",               image: null },
];

const devTeam: Person[] = [
  // TODO: replace names, roles, and image paths below
  { name: "[Dev Name]",        role: "Full-stack Developer",              image: null },
  { name: "[Dev Name]",        role: "Frontend Developer",                image: null },
  { name: "[Dev Name]",        role: "Backend Developer",                 image: null },
];

// ─── Floating image component ─────────────────────────────────────────────────

function FloatingImage({
  person,
  mouseX,
  mouseY,
}: {
  person: Person | null;
  mouseX: number;
  mouseY: number;
}) {
  const OFFSET_X = 24;
  const OFFSET_Y = -60;

  const style: React.CSSProperties = {
    left: mouseX + OFFSET_X,
    top: mouseY + OFFSET_Y,
  };

  return (
    <div
      className={`${styles.imageFloat} ${person ? styles.visible : ""}`}
      style={style}
    >
      <div className={styles.imageFloatInner}>
        {person?.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={person.image} alt={person.name} />
        ) : (
          <div className={styles.placeholder}>👤</div>
        )}
        <p className={styles.imageFloatName}>{person?.name}</p>
        <p className={styles.imageFloatRole}>{person?.role}</p>
      </div>
    </div>
  );
}

// ─── Person row ───────────────────────────────────────────────────────────────

function PersonRow({
  person,
  onHover,
  onLeave,
}: {
  person: Person;
  onHover: (p: Person) => void;
  onLeave: () => void;
}) {
  return (
    <div className={styles.row}>
      <div
        className={styles.nameCell}
        onMouseEnter={() => onHover(person)}
        onMouseLeave={onLeave}
      >
        <span className={styles.name}>{person.name}</span>
        <span className={styles.nameArrow}>→</span>
      </div>
      <div className={styles.roleCell}>
        <span className={styles.role}>{person.role}</span>
      </div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

function TeamSection({
  label,
  people,
  onHover,
  onLeave,
}: {
  label: string;
  people: Person[];
  onHover: (p: Person) => void;
  onLeave: () => void;
}) {
  return (
    <div className={styles.section}>
      <p className={styles.sectionHead}>{label}</p>
      <div className={styles.table}>
        <div className={styles.tableHead}>
          <span className={styles.tableHeadCell}>Name</span>
          <span className={styles.tableHeadCell}>Role</span>
        </div>
        {people.map((p, i) => (
          <PersonRow key={i} person={p} onHover={onHover} onLeave={onLeave} />
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TeamPage() {
  const [hovered, setHovered] = useState<Person | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMouse({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return (
    <div className={styles.page}>

      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.heroEyebrow}>Allergo Express Med</p>
          <h1 className={styles.heroTitle}>Meet the Team</h1>
          <p className={styles.heroSub}>The people behind your results.</p>
        </div>
      </div>

      <div className={styles.body}>
        <TeamSection
          label="Medical Team"
          people={medicalTeam}
          onHover={setHovered}
          onLeave={() => setHovered(null)}
        />
        <TeamSection
          label="Development Team"
          people={devTeam}
          onHover={setHovered}
          onLeave={() => setHovered(null)}
        />
      </div>

      <FloatingImage
        person={hovered}
        mouseX={mouse.x}
        mouseY={mouse.y}
      />
    </div>
  );
}