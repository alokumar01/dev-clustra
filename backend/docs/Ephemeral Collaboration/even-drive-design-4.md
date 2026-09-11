# Event Driven Design (Phase 1)

**Project:** DevClustra

**Document:** Event Driven Design

**Version:** 1.0

---

# 1. Philosophy

DevClustra is an event-driven system.

Every action performed by a participant becomes an event.

Events are the communication language between:

* Browser
* Socket Server
* Database

The frontend never directly modifies state.

The frontend requests.

The server validates.

The server updates state.

The server broadcasts the result.

---

# 2. Event Flow

```text
Client

↓

Send Event

↓

Validate

↓

Business Logic

↓

Database

↓

Broadcast

↓

Clients Update UI
```

Never broadcast before validation.

Never trust client data.

---

# 3. Event Naming Rules

Events use verbs.

Good

```text
session:join
message:send
participant:update
```

Bad

```text
join
chat
data
test
```

Events should clearly describe intent.

---

# 4. Client → Server Events

## session:create

Purpose

Create a new temporary session.

Expected Result

Return session code.

---

## session:join

Purpose

Join an existing session.

Validation

* Session exists
* Session active
* Participant limit not exceeded

Success

Participant joins room.

Failure

Error returned.

---

## session:leave

Purpose

Participant voluntarily leaves.

---

## participant:update

Purpose

Change display name.

Future

Avatar update.

---

## message:send

Purpose

Send chat message.

Validation

* Session exists
* Participant connected
* Message length
* Rate limit

Success

Store message.

Broadcast.

---

## typing:start

Purpose

Participant started typing.

No database write.

Temporary event.

---

## typing:stop

Purpose

Participant stopped typing.

Temporary.

---

## heartbeat

Purpose

Keep participant alive.

Updates presence.

No message storage.

---

# 5. Server → Client Events

## session:joined

Sent after successful join.

Contains

* Session Info
* Participants
* Recent Messages

---

## session:expired

Session removed.

Client redirects.

---

## participant:joined

Broadcast.

Participant list updates.

---

## participant:left

Broadcast.

Participant removed.

---

## participant:updated

Broadcast.

Name changed.

---

## owner:changed

Broadcast.

New owner assigned.

---

## message:created

Broadcast.

New chat message.

---

## typing:started

Broadcast.

Display typing indicator.

---

## typing:stopped

Broadcast.

Hide typing indicator.

---

## error

General event.

Contains

* Code
* Message

---

# 6. Validation Pipeline

Every event follows identical steps.

```text
Receive Event

↓

Validate Payload

↓

Validate Session

↓

Validate Participant

↓

Business Logic

↓

Database

↓

Broadcast

↓

Acknowledgement
```

No shortcuts.

---

# 7. Error Handling

Possible Errors

SESSION_NOT_FOUND

SESSION_FULL

INVALID_NAME

INVALID_MESSAGE

RATE_LIMITED

NOT_OWNER

UNKNOWN_ERROR

Never expose stack traces.

---

# 8. Acknowledgements

Every client request receives an acknowledgement.

Example

Success

```text
success: true
```

Failure

```text
success: false

reason: SESSION_FULL
```

Never leave clients waiting.

---

# 9. Event Categories

Session

```text
session:create

session:join

session:leave

session:expired
```

Participant

```text
participant:update

participant:joined

participant:left

owner:changed
```

Message

```text
message:send

message:created
```

Presence

```text
typing:start

typing:stop

heartbeat
```

Future

```text
file:upload

voice:start

video:start

whiteboard:update
```

Everything fits the same naming convention.

---

# 10. Broadcast Rules

Never broadcast globally.

Broadcast only inside:

```text
session:{sessionCode}
```

Every session is isolated.

---

# 11. Presence

Presence is runtime state.

Never permanently stored.

Examples

Online

Offline

Typing

Idle

Redis will store this in future.

---

# 12. Security Rules

Every event validates

* Session
* Participant
* Payload
* Permissions

Reject invalid events immediately.

Never trust browser data.

---

# 13. Rate Limits

Future

Session Creation

10/hour

Message Sending

20/sec

Join Attempts

30/min

Typing

Debounced

Limits should be configurable.

---

# 14. Logging

Log

Session Created

Participant Joined

Participant Left

Owner Changed

Session Deleted

Do not log message content.

---

# 15. Future Events

Message

```text
message:edit

message:delete

message:react
```

Files

```text
file:upload

file:delete
```

Voice

```text
voice:join

voice:leave
```

Whiteboard

```text
whiteboard:update
```

AI

```text
ai:generate

ai:response
```

The architecture already supports them.

---

# 16. Event Design Principles

* Events describe actions.
* Server owns business logic.
* Clients never mutate shared state directly.
* Validation happens before persistence.
* Persistence happens before broadcasting.
* Every event has a predictable lifecycle.
* Event names remain stable even as the implementation evolves.

---

# Event Lifecycle

```text
Participant

↓

Creates Event

↓

Socket.IO

↓

Validation

↓

Business Logic

↓

MongoDB

↓

Broadcast

↓

Clients Render

↓

UI Updated
```

Every feature added to DevClustra should follow this same lifecycle.
