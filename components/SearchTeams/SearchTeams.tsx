"use client"

import Fuse from "fuse.js"
import type { CompleteTeamData } from "@/functions/db/teams"
import { useState, useRef, useMemo, useEffect } from "react"

import styles from "./SearchTeams.module.css"

interface SearchTeamsProps {
  teams: CompleteTeamData[]
  onSelect?: (teamId: string) => void
}

export function SearchTeams({ teams, onSelect }: SearchTeamsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedTeamId, setSelectedTeamId] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  const fuse = useMemo(
    () =>
      new Fuse(teams, {
        keys: ["teamId"],
        threshold: 0.3
      }),
    [teams]
  )

  const results = useMemo(() => {
    if (!search) return teams
    return fuse.search(search).map((result) => result.item)
  }, [fuse, search, teams])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node)
      )
        setIsOpen(false)
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  function handleSelect(team: CompleteTeamData) {
    setSelectedTeamId(team.id)
    setSearch(team.id)
    setIsOpen(false)

    if (onSelect) onSelect(team.id)
  }

  return (
    <div className={styles.searchContainer}>
      <input type="hidden" name="to" value={selectedTeamId} />
      <input
        ref={inputRef}
        type="text"
        className={styles.searchInput}
        placeholder="Search for a team by id..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
          setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
      />
      {isOpen && (
        <div ref={resultsRef} className={styles.resultsContainer}>
          {results.length > 0 ? (
            results.map((team) => (
              <div
                key={team.id}
                className={`${styles.resultItem} ${selectedTeamId === team.id ? styles.selected : ""}`}
                onClick={() => handleSelect(team)}
              >
                <span>{team.id}</span>
                <span className={styles.email}>
                  {team.participants
                    .map((participant) => participant.name)
                    .join(", ")}
                </span>
              </div>
            ))
          ) : (
            <div className={styles.noResults}>No teams found</div>
          )}
        </div>
      )}
    </div>
  )
}
