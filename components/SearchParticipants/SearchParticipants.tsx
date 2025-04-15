"use client";

import * as React from "react";
import Fuse from "fuse.js";
import styles from "./search-participants.module.css";

type Participant = {
  name: string;
  email: string;
  teamId: string;
};

interface SearchParticipantsProps {
  participants: Participant[];
  onSelect?: (email: string) => void;
}

export function SearchParticipants({
  participants,
  onSelect,
}: SearchParticipantsProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [selectedEmail, setSelectedEmail] = React.useState("");
  const [, setSelectedName] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const resultsRef = React.useRef<HTMLDivElement>(null);

  const fuse = React.useMemo(
    () =>
      new Fuse(participants, {
        keys: ["name"],
        threshold: 0.3,
      }),
    [participants],
  );

  const results = React.useMemo(() => {
    if (!search) return participants;
    return fuse.search(search).map((result) => result.item);
  }, [fuse, search, participants]);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node)
      )
        setIsOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleSelect(participant: Participant) {
    setSelectedEmail(participant.email);
    setSelectedName(participant.name);
    setSearch(participant.name);
    setIsOpen(false);

    if (onSelect) onSelect(participant.email);
  }

  return (
    <div className={styles.searchContainer}>
      <input type="hidden" name="to" value={selectedEmail} />
      <input
        ref={inputRef}
        type="text"
        className={styles.searchInput}
        placeholder="Search for a participant by name..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
      />
      {isOpen && (
        <div ref={resultsRef} className={styles.resultsContainer}>
          {results.length > 0 ? (
            results.map((participant) => (
              <div
                key={participant.email}
                className={`${styles.resultItem} ${selectedEmail === participant.email ? styles.selected : ""}`}
                onClick={() => handleSelect(participant)}
              >
                <span>{participant.name}</span>
                <span className={styles.email}>{participant.email}</span>
              </div>
            ))
          ) : (
            <div className={styles.noResults}>No participants found</div>
          )}
        </div>
      )}
    </div>
  );
}
