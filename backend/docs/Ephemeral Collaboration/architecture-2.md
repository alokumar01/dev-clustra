# System Architecture (Phase 1)

**Project:** DevClustra
**Feature:** Anonymous Temporary Collaboration Sessions
**Document:** Architecture Design
**Version:** 1.0

---

# 1. Architecture Overview

Phase 1 follows a modular architecture.

```
                Browser
                    │
        ┌───────────┴───────────┐
        │                       │
    HTTP API              Socket.IO
        │                       │
        └───────────┬───────────┘
                    │
             Application Server
                    │
        ┌───────────┴───────────┐
        │                       │
     MongoDB              Redis (Future)
```

---

# 2. Responsibilities

## Browser

Responsible for

* UI
* Session storage
* Socket connection
* Rendering chat
* Managing local participant state

Browser never decides business rules.

---

## HTTP API

Responsible for

* Create Session
* Join Session Validation
* Session Information
* Session Metadata

HTTP is used for request-response operations.

---

## Socket Server

Responsible for

* Join Room
* Leave Room
* Send Message
* Typing
* Presence
* Broadcast Events

Everything real-time belongs here.

---

## MongoDB

Stores permanent data.

Collections

* Sessions
* Participants
* Messages

Mongo is the source of truth.

---

## Redis (Future)

Stores temporary data.

Examples

* Online participants
* Socket IDs
* Typing users
* Rate limits
* Session cache

Redis can disappear without losing chat history.

---

# 3. Request Flow

Example

Create Session

```
Browser

↓

POST /session

↓

Server

↓

MongoDB

↓

Generate Session

↓

Return Share Link
```

---

Join Session

```
Browser

↓

GET Session

↓

Validate

↓

Open Socket

↓

Join Room

↓

Participant Created

↓

Broadcast Joined
```

---

# 4. Message Flow

Participant

↓

Type Message

↓

Socket Event

↓

Validation

↓

Store Mongo

↓

Broadcast

↓

Clients Render

Every message follows this exact pipeline.

---

# 5. Session Creation Flow

```
Homepage

↓

Session Page

↓

Create Session

↓

Generate Session Code

↓

Create Owner Participant

↓

Store Session

↓

Return Session Link

↓

Connect Socket

↓

Owner Ready
```

---

# 6. Join Flow

```
Open Link

↓

Load Session

↓

Session Exists?

↓

YES

↓

Generate Participant

↓

Connect Socket

↓

Join Socket Room

↓

Broadcast Participant Joined

↓

Ready
```

If Session does not exist

↓

404 Session Expired

---

# 7. Disconnect Flow

```
Socket Disconnect

↓

Mark Participant Offline

↓

Participants Remaining?

↓

YES

↓

Continue Session

↓

NO

↓

Start Expiration Timer

↓

Timer Finished?

↓

YES

↓

Delete Session

↓

Delete Participants

↓

Delete Messages
```

---

# 8. Reconnection Flow

Browser Refresh

↓

Reconnect Socket

↓

Read sessionStorage

↓

Participant Token Exists?

↓

YES

↓

Restore Participant

↓

Continue

↓

NO

↓

Create New Participant

Browser Close

↓

sessionStorage Cleared

↓

Identity Lost

---

# 9. Data Ownership

```
Session

1

↓

Many

Participants


Session

1

↓

Many

Messages


Participant

1

↓

Many

Messages
```

Messages never own Sessions.

Participants never own Sessions.

Session owns everything.

---

# 10. Database Collections

## Sessions

Stores

* Metadata
* Owner
* Status
* Expiration
* Configuration

Never stores messages.

---

## Participants

Stores

* Identity
* Role
* Status
* Session Reference

---

## Messages

Stores

* Text
* Sender
* Session
* Expiration

Independent collection.

---

# 11. Socket Rooms

Every Session corresponds to exactly one Socket.IO room.

Example

```
Session

ABC123

↓

Socket Room

session:ABC123
```

Participants never broadcast globally.

Everything happens inside the room.

---

# 12. Validation Pipeline

Every incoming request passes through

```
Receive

↓

Validate Session

↓

Validate Participant

↓

Validate Payload

↓

Business Logic

↓

Database

↓

Broadcast
```

Never broadcast before validation.

---

# 13. Failure Scenarios

Session Deleted

↓

Reject Join

Participant Removed

↓

Disconnect Socket

Database Error

↓

Reject Request

Invalid Session

↓

404

Invalid Payload

↓

400

Unexpected Error

↓

500

Never crash the Socket server.

---

# 14. Scaling Plan

Phase 1

```
Single Server

↓

Socket.IO

↓

MongoDB
```

Phase 2

```
Load Balancer

↓

Multiple Socket Servers

↓

Redis Adapter

↓

MongoDB
```

Because Socket.IO rooms become shared through Redis.

No application logic changes.

---

# 15. Security

Validate

* Session ID
* Participant Token
* Message Length
* Display Name

Sanitize

* HTML
* XSS
* Script Injection

Rate Limit

* Session Creation
* Join Requests
* Messages

---

# 16. Logging

Log

* Session Created
* Session Deleted
* Participant Joined
* Participant Left
* Owner Changed
* Message Sent

Never log message contents in production.

---

# 17. Monitoring

Track

* Active Sessions
* Active Participants
* Messages per Minute
* Join Success Rate
* Disconnect Rate
* Average Session Duration

These metrics help identify performance problems.

---

# 18. Design Decisions

Decision

Session owns Participants.

Reason

Participants only exist inside Sessions.

---

Decision

Messages stored separately.

Reason

Unlimited message growth.

---

Decision

Anonymous identities.

Reason

No authentication required.

---

Decision

Socket.IO rooms.

Reason

Efficient message broadcasting.

---

Decision

Redis postponed.

Reason

Premature optimization is unnecessary for Phase 1.

---

# 19. Future Architecture

Future modules

```
Session

├── Chat

├── Presence

├── Voice

├── Video

├── Whiteboard

├── Files

├── AI

├── Notifications

└── Analytics
```

The Session remains the root object.

New capabilities plug into it without redesigning the system.

---

# Architecture Principles

* Session-first architecture.
* Single source of truth in MongoDB.
* Real-time communication through Socket.IO.
* Temporary state belongs in Redis.
* Keep services loosely coupled.
* Design for future collaboration features without changing the core model.
