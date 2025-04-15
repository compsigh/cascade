"use client";

import type React from "react";

import { useState, useTransition } from "react";
import { Button } from "@/components/Button";
import { Spacer } from "@/components/Spacer";
import { SearchInput } from "@/components/SearchInput";
import { Participant } from "@/generated/client";

type Invite = {
  id: string;
  fromParticipantEmail: string;
  toParticipantEmail: string;
};

export interface InviteSystemProps {
  participant: Participant;
  allParticipants: Participant[];
  initialInvitesSent: Invite[];
  team: Participant[];
  maxTeamSize: number;
  maxInvites: number;
  onSendInvite: (from: string, to: string) => Promise<Invite>;
  onCancelInvite: (id: string) => Promise<Invite>;
}

export function InviteSystem({
  participant,
  allParticipants,
  initialInvitesSent,
  team,
  maxTeamSize,
  maxInvites,
  onSendInvite,
  onCancelInvite,
}: InviteSystemProps) {
  // State for tracking invites including optimistic updates
  const [invitesSent, setInvitesSent] = useState<Invite[]>(initialInvitesSent);
  const [pendingInvites, setPendingInvites] = useState<Set<string>>(new Set());
  const [pendingCancellations, setPendingCancellations] = useState<Set<string>>(
    new Set(),
  );
  const [selectedEmail, setSelectedEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Filter participants to exclude current user and those already invited
  const availableParticipants = allParticipants.filter(
    (p) =>
      !invitesSent.some((invite) => invite.toParticipantEmail === p.email) &&
      !team.some((teammate) => teammate.email === p.email) &&
      !pendingInvites.has(p.email),
  );

  // Calculate effective counts including pending actions
  const effectiveInviteCount =
    invitesSent.length + pendingInvites.size - pendingCancellations.size;

  // Check if user can send more invites
  const canSendInvite =
    maxTeamSize !== null &&
    maxInvites !== null &&
    team.length < maxTeamSize &&
    effectiveInviteCount < maxInvites;

  // Handle sending an invite with optimistic update
  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEmail || !canSendInvite) return;

    // Validate
    if (maxInvites !== null && effectiveInviteCount >= maxInvites) {
      setError("You've reached the maximum number of invites");
      return;
    }

    // Add to pending set for optimistic UI update
    setPendingInvites((prev) => new Set(prev).add(selectedEmail));
    setSelectedEmail("");
    setError(null);

    // Send the actual invite
    startTransition(async () => {
      try {
        const newInvite = await onSendInvite(participant.email, selectedEmail);

        if (newInvite) {
          // Update with the server response
          setInvitesSent((prev) => [...prev, newInvite]);
        } else {
          setError("Failed to send invite");
        }
      } catch (err) {
        setError("An error occurred while sending the invite");
        console.error(err);
      } finally {
        // Remove from pending set
        setPendingInvites((prev) => {
          const updated = new Set(prev);
          updated.delete(selectedEmail);
          return updated;
        });
      }
    });
  };

  // Handle canceling an invite with optimistic update
  const handleCancelInvite = async (inviteId: string) => {
    // Find the invite to cancel
    const inviteToCancel = invitesSent.find((invite) => invite.id === inviteId);
    if (!inviteToCancel) return;

    // Add to pending cancellations for optimistic UI update
    setPendingCancellations((prev) => new Set(prev).add(inviteId));

    // Optimistically update the UI
    setInvitesSent((prev) => prev.filter((invite) => invite.id !== inviteId));

    // Send the actual cancellation request
    startTransition(async () => {
      try {
        await onCancelInvite(inviteId);
      } catch (err) {
        // Revert the optimistic update if there's an error
        setInvitesSent((prev) => [...prev, inviteToCancel]);
        console.error(err);
      } finally {
        // Remove from pending cancellations
        setPendingCancellations((prev) => {
          const updated = new Set(prev);
          updated.delete(inviteId);
          return updated;
        });
      }
    });
  };

  return (
    <div>
      {/* Invite Form Section */}
      <Spacer size={16} />
      <h2>invite a friend to join your team</h2>
      <p>search for a participant by name to invite them to your team</p>
      <Spacer size={8} />

      {maxTeamSize !== null && team.length >= maxTeamSize && (
        <p>
          you&apos;ve reached the maximum of {maxTeamSize} participants on your
          team
        </p>
      )}

      {maxInvites !== null && effectiveInviteCount >= maxInvites && (
        <p>
          you can have a maximum of {maxInvites} active invites; you&apos;ll
          have to cancel one to send a new one
        </p>
      )}

      {error && <p>{error}</p>}

      {canSendInvite && (
        <form onSubmit={handleSendInvite}>
          <SearchInput
            participants={availableParticipants}
            onSelect={(email) => setSelectedEmail(email)}
          />
          <Spacer size={8} />
          <Button type="submit" disabled={!selectedEmail || isPending}>
            {isPending ? "sending..." : "send invite"}
          </Button>
        </form>
      )}

      {/* Outgoing Invites List Section */}
      <Spacer size={16} />
      <h2>invites you&apos;ve sent</h2>
      {invitesSent.length === 0 ? (
        <p>no invites sent</p>
      ) : (
        <ul>
          {invitesSent.map((invite) => (
            <li key={invite.id}>
              <p>to: {invite.toParticipantEmail}</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCancelInvite(invite.id);
                }}
              >
                <Button
                  type="submit"
                  disabled={pendingCancellations.has(invite.id)}
                >
                  {pendingCancellations.has(invite.id)
                    ? "canceling..."
                    : "cancel"}
                </Button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
