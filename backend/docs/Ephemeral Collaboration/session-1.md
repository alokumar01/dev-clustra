# Session Design Document (Phase 1)

**Project:** DevClustra
**Feature:** Anonymous Temporary Collaboration Session
**Version:** 1.0 (Phase 1)
**Status:** Design

---

# 1. Overview

Session is an anonymous, temporary collaboration space where users can communicate in real time without creating an account.

Unlike traditional chat applications, a Session is **not tied to user accounts**. Every participant is anonymous and exists only for the lifetime of their browser session.

The long-term vision is to evolve Session into a complete real-time collaboration platform supporting chat, file sharing, whiteboards, AI, voice, video, and code collaboration.

Phase 1 focuses only on **real-time chat**.

---

# 2. Goals

## Primary Goals

* Anonymous participation
* No login or signup
* Fast session creation
* Easy sharing
* Real-time messaging
* Automatic cleanup
* Simple user experience

---

## Non Goals (Phase 1)

Not implementing:

* Voice
* Video
* Screen Sharing
* File Upload
* Whiteboard
* Code Editor
* AI Assistant
* Authentication
* Persistent History

---

# 3. Core Philosophy

The application is **Session-first**, not Chat-first.

Chat is only one capability inside a Session.

Future capabilities should be added without changing the architecture.

Example:

Session

├── Chat

├── Participants

├── Presence

├── Files

├── Whiteboard

├── AI

├── Voice

└── Video

---

# 4. Core Entities

Phase 1 contains only three domain entities.

## Session

Represents the temporary collaboration space.

Responsible for:

* lifecycle
* ownership
* settings
* expiration

---

## Participant

Represents an anonymous identity inside a Session.

Participants are **not users**.

There is no account.

There is no authentication.

Closing the browser permanently removes the participant identity.

---

## Message

Represents a chat message.

Messages belong to a Session and are created by a Participant.

---

# 5. Anonymous Identity

Each participant receives:

* Random display name
* Random avatar
* Unique participantId

Example names

* Blue Panda
* Silent Fox
* Orange Falcon
* Bright Tiger

Before entering the chat, participants may edit:

* Display Name

Avatar editing is optional for Phase 1.

---

# 6. Identity Rules

Browser Refresh

→ Same participant (using sessionStorage)

Browser Close

→ Identity destroyed

Opening another browser

→ New participant

Incognito window

→ New participant

No cookies are required.

No login is required.

No permanent identity exists.

---

# 7. Session Lifecycle

CREATE

↓

WAITING

↓

ACTIVE

↓

EMPTY

↓

EXPIRING

↓

DELETED

Definitions

CREATE

Session is generated.

WAITING

Owner is waiting for participants.

ACTIVE

At least one participant is connected.

EMPTY

Everyone disconnected.

EXPIRING

Cleanup timer starts.

DELETED

Session removed permanently.

---

# 8. Participant Lifecycle

JOIN

↓

CONNECTED

↓

DISCONNECTED

↓

RECONNECTED

↓

EXPIRED

If reconnect occurs before timeout,

participant continues.

Otherwise,

participant expires permanently.

---

# 9. Message Lifecycle

CREATED

↓

DELIVERED

↓

VISIBLE

↓

EXPIRED

↓

DELETED

---

# 10. Ownership

The creator becomes the Owner.

Owner responsibilities:

* Rename Session (future)
* Configure expiration
* Configure message timer
* Remove participants (future)
* Lock session (future)

If Owner disconnects permanently,

ownership transfers to the oldest active participant.

Ownership never automatically returns.

---

# 11. Session Expiration

A Session remains active while participants are connected.

When the final participant disconnects:

Start expiration timer.

If someone reconnects before timeout:

Cancel expiration.

If timeout completes:

Delete Session permanently.

Recommended timeout:

30 minutes

---

# 12. Message Expiration

Messages are temporary.

Default:

Remain until Session deletion.

Future:

Owner may configure:

* Never (until session deletion)
* 1 minute
* 5 minutes
* 30 minutes
* 1 hour
* Custom duration

Expired messages are permanently deleted.

---

# 13. Join Flow

Homepage

↓

Session

↓

Create Session

↓

Generate Session Code

↓

Generate Share Link

↓

Share Link

↓

Participant Opens Link

↓

Random Identity

↓

Edit Name

↓

Join Chat

↓

Connected

---

# 14. Session Link

Example

/session/ABX73Q

Rules

* Random session code
* Hard to guess
* Valid only while session exists

Once Session is deleted,

the link becomes invalid.

No fixed one-hour expiration is used.

The session lifecycle determines link validity.

---

# 15. Participant Limits

Phase 1 default:

100 participants

Reason:

* Prevent abuse
* Simpler Socket.IO scaling
* Better UI
* Lower infrastructure cost

Future:

Owner configurable.

---

# 16. Abuse Prevention

Phase 1

* Rate limit joins
* Join cooldown
* Maximum participants
* Input validation

Future

* Redis rate limiting
* IP throttling
* Spam detection
* Captcha
* Profanity filter

---

# 17. Data Storage

MongoDB stores permanent Session data.

Collections

Sessions

Participants

Messages

Redis (Future)

Socket mapping

Presence

Typing indicators

Online participants

Rate limits

Temporary cache

---

# 18. Socket Events

Client

connect

disconnect

join-session

leave-session

send-message

typing-start

typing-stop

rename-participant

Server

participant-joined

participant-left

message-created

participant-renamed

owner-changed

session-expiring

session-deleted

---

# 19. Future Features

Phase 2

* Typing indicator
* Read receipts
* Emoji reactions

Phase 3

* Voice Chat
* Screen Sharing
* Files

Phase 4

* Whiteboard
* AI Assistant
* Code Collaboration

Phase 5

* End-to-End Encryption
* Moderation
* Session Analytics

---

# 20. Open Design Questions

Before implementation, answer:

1. Should reconnect restore unsent drafts?
2. Should owner manually end the session?
3. Should inactive participants be removed automatically?
4. Should message timers be configurable by all participants or only owner?
5. Should deleted messages disappear instantly or after synchronization?
6. Should guests be able to rename themselves multiple times?
7. How many reconnection attempts are allowed?
8. What happens when MongoDB is unavailable?
9. What happens if Redis becomes unavailable in future?
10. How should duplicate tabs be handled?

---

# 21. Design Principles

* Sessions are temporary.
* Participants are anonymous.
* Identity is browser-session scoped.
* Chat is a feature, not the product.
* Permanent storage is minimized.
* Architecture should support future collaboration features.
* Simplicity is preferred over premature optimization.
* Every feature should fit naturally into the Session model.

---

# Version History

Version 1.0

* Initial architecture
* Phase 1 design
* Anonymous temporary chat
* Session lifecycle
* Participant lifecycle
* Message lifecycle
* Future scalability plan
