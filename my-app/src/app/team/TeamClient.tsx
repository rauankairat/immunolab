"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./page.module.css";

interface Person {
  name: string;
  role: string;
  image: string | null;
  linkedin?: string;
}

type Labels = {
  eyebrow: string;
  title: string;
  sub: string;
  medicalTeam: string;
  devTeam: string;
  tableName: string;
  tableRole: string;
};

const medicalTeam: Person[] = [
  { name: "Dr. [Name]", role: "Allergist / Immunologist",  image: null },
  { name: "Dr. [Name]", role: "Allergist / Immunologist",  image: null },
  { name: "Dr. [Name]", role: "Paediatric Allergist",      image: null },
  { name: "Dr. [Name]", role: "Paediatric Allergist",      image: null },
  { name: "[Name]",     role: "Senior Lab Technician",     image: null },
  { name: "[Name]",     role: "Lab Technician",            image: null },
  { name: "[Name]",     role: "Lab Technician",            image: null },
  { name: "[Name]",     role: "Nurse / Sample Collection", image: null },
  { name: "[Name]",     role: "Nurse / Sample Collection", image: null },
  { name: "[Name]",     role: "Patient Coordinator",       image: null },
];

const devTeam: Person[] = [
  { name: "Rauan Kairat",   role: "Lead Software Engineer", image: null, linkedin: "https://www.linkedin.com/in/rkairat-seng/" },
  { name: "Mustafa Rizwan", role: "UI Designer",            image: null, linkedin: "https://www.linkedin.com/in/mustafa-rizwan-2a949b330/" },
  { name: "Nawfal Lodhi",   role: "Frontend Developer",     image: null, linkedin: "https://www.linkedin.com/in/nawfal-lodhi-bb061829b/" },
];

function LinkedInIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function FloatingImage({ person, mouseX, mouseY }: { person: Person | null; mouseX: number; mouseY: number }) {
  const style: React.CSSProperties = { left: mouseX + 24, top: mouseY - 60 };
  return (
    <div className={`${styles.imageFloat} ${person ? styles.visible : ""}`} style={style}>
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

function PersonRow({ person, onHover, onLeave }: { person: Person; onHover: (p: Person) => void; onLeave: () => void }) {
  return (
    <div className={styles.row}>
      <div
        className={styles.nameCell}
        onMouseEnter={() => onHover(person)}
        onMouseLeave={onLeave}
      >
        <span className={styles.name}>{person.name}</span>
        <span className={styles.nameArrow}>→</span>
        {person.linkedin && (
          <a
            href={person.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.linkedinBtn}
            onClick={(e) => e.stopPropagation()}
            title="LinkedIn"
          >
            <LinkedInIcon />
          </a>
        )}
      </div>
      <div className={styles.roleCell}>
        <span className={styles.role}>{person.role}</span>
      </div>
    </div>
  );
}

function TeamSection({ label, people, nameLabel, roleLabel, onHover, onLeave }: {
  label: string;
  people: Person[];
  nameLabel: string;
  roleLabel: string;
  onHover: (p: Person) => void;
  onLeave: () => void;
}) {
  return (
    <div className={styles.section}>
      <p className={styles.sectionHead}>{label}</p>
      <div className={styles.table}>
        <div className={styles.tableHead}>
          <span className={styles.tableHeadCell}>{nameLabel}</span>
          <span className={styles.tableHeadCell}>{roleLabel}</span>
        </div>
        {people.map((p, i) => (
          <PersonRow key={i} person={p} onHover={onHover} onLeave={onLeave} />
        ))}
      </div>
    </div>
  );
}

export default function TeamClient({ labels }: { labels: Labels }) {
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
          <p className={styles.heroEyebrow}>{labels.eyebrow}</p>
          <h1 className={styles.heroTitle}>{labels.title}</h1>
          <p className={styles.heroSub}>{labels.sub}</p>
        </div>
      </div>

      <div className={styles.body}>
        <TeamSection
          label={labels.medicalTeam}
          people={medicalTeam}
          nameLabel={labels.tableName}
          roleLabel={labels.tableRole}
          onHover={setHovered}
          onLeave={() => setHovered(null)}
        />
        <TeamSection
          label={labels.devTeam}
          people={devTeam}
          nameLabel={labels.tableName}
          roleLabel={labels.tableRole}
          onHover={setHovered}
          onLeave={() => setHovered(null)}
        />
      </div>

      <FloatingImage person={hovered} mouseX={mouse.x} mouseY={mouse.y} />
    </div>
  );
}