# Design of Ephemeral Colloboration Chat Room Sprint 4 Plan
 Ephemeral chat room where multiple users can join chat room, do chats, without login and signup.

 As a user comes to my website generate link and share the link and anyone can able to join that chat, with features supporting in this is auto deleteions message, send imojis, pic limited but supported later not in first phase.

 now this colloboration chat room is not for spam purpose it for lets communite with others without sharing your identity, and important message is not stored in our server just direct to direct means no server storage is there, later it supports with encyrption of message but not right now, so that only the joined room users see the messages, not anyone in any way from deveoper console, or any tools, striclty forcing this. so that only the requested users joined chat room, do message do chats

## Phase 4.1
    Design Ephemeral.
    Private chat?
    Separate room? Think not one to one chat means one who genrete the link and share to any one so this is called room, even one joined two joined not a problme at all, if personal chat the two ways either send link to only that pople or make accoutn on devclustra.
    Timer? dont have idea Rit now
    Expiration? yes link expires after one
    Delete immediately? featurs of auto delete by default is off, when user create room chat a auto deletion option showed
    Countdown? is for other purpose like limit that this room is valid for 1 hrs also by default off,
    next when user try to reload the page i need to stop that behaviour


We'll treat it exactly like Auth and Messaging:

Phase 4.1: Product design & lifecycle
Phase 4.2: Database design
Phase 4.3: Backend implementation
Phase 4.4: Frontend integration
Phase 4.5: Real-time behavior & cleanup


Visual architecture
               Room Key (K)
                     │
     ┌───────────────┼───────────────┐
     │               │               │
 Alice           Bob          Charlie ... User100
     │               │               │
     └──── Encrypt with K ───────────┘
                     │
                     ▼
              WebSocket Server
          (cannot decrypt messages)
                     │
                     ▼
         Broadcast encrypted data
                     │
     ┌───────────────┼───────────────┐
     │               │               │
 Alice           Bob          Charlie
  decrypt(K)     decrypt(K)    decrypt(K)
For your use case, I would recommend:
AES-256-GCM for encrypting all message payloads.
Generate a random 256-bit room key when the room is created.
Put the room key in the URL fragment (#...) or otherwise share it directly with participants without sending it to the server.
Use Web Crypto API in the browser (or your platform's secure crypto library) to perform encryption and decryption.
Keep only routing information (room ID, timestamps, etc.) visible to the server.

This approach is much simpler than implementing a full group messaging protocol like Signal and is well



Example

Suppose your website is

https://chat.example.com

John creates a room.

Step 1: Generate IDs

The browser generates:

Room ID:
R = 7Fk29LpQ

Room Key:
K = 3af8b2d1f4c6e98a...
(32 random bytes)

Room ID is not secret.

Room Key is secret.

Step 2: Create URL

The browser creates:

https://chat.example.com/room/7Fk29LpQ#3af8b2d1f4c6e98a...

Notice the #.

Everything before #:

https://chat.example.com/room/7Fk29LpQ

goes to the server.

Everything after #:

3af8b2d1f4c6e98a...

stays inside the browser.

What actually happens?

Browser requests

GET /room/7Fk29LpQ HTTP/1.1
Host: chat.example.com

Server receives:

Room ID = 7Fk29LpQ

Server DOES NOT receive:

3af8b2d1f4c6e98a...

because URL fragments (#...) are never sent in HTTP requests.

Think of it like this:

Browser
---------------------------------------------------
https://chat.example.com/room/7Fk29LpQ#SECRETKEY
                                        ↑
                             Browser uses this only

HTTP Request
---------------------------------------------------
GET /room/7Fk29LpQ

Server never receives #SECRETKEY
Step 3: What does the server store?

Database:

Rooms

-----------------------------
Room ID: 7Fk29LpQ
Created By: John
Expires: Tomorrow
Users Online: 0
-----------------------------

That's all.

No encryption key.

No messages.

Step 4: John shares link

John copies

https://chat.example.com/room/7Fk29LpQ#3af8b2d1f4c6e98a...

and sends it via:

WhatsApp
Email
Discord
Slack
Step 5: Alice opens link

Alice's browser gets

https://chat.example.com/room/7Fk29LpQ#3af8b2...

Browser separates:

Room ID

7Fk29LpQ

Room Key

3af8b2...

The browser keeps the key in memory (or session storage if you choose).

Server only receives

Join Room

7Fk29LpQ
Step 6: Bob joins

Same thing.

Bob now has

Room Key

3af8b2...
Step 7: Charlie joins

Same.

Everyone has

Room Key

3af8b2...
Now 100 people
John
Alice
Bob
Charlie
David
Emily
...
User100

↓

All have

K = 3af8...

Only one key.

John sends message

He types

Hello everyone

Browser encrypts

AES-GCM

Key = K

↓

Ciphertext

A82jd93jjd...

Browser sends

{
  "roomId":"7Fk29LpQ",
  "ciphertext":"A82jd93jjd..."
}
Server

Server receives

{
  "roomId":"7Fk29LpQ",
  "ciphertext":"A82jd93jjd..."
}

Server cannot read it.

It simply broadcasts:

↓

Alice

↓

Bob

↓

Charlie

↓

Everyone
Alice decrypts

Browser does

AES-GCM

Key = K

↓

Hello everyone

Same for every participant.

What if server database leaks?

Attacker gets

Room ID

7Fk29LpQ

Ciphertext

A82jd93jjd...

No key.

So messages remain unreadable.

What if someone gets the invite link?

The link contains the key:

https://chat.example.com/room/7Fk29LpQ#KEY

So anyone with the link can join and decrypt messages.

This is called a capability URL—the link itself grants access.

For a temporary collaboration room, that's often acceptable, but it means users should treat the link like a password.

If you don't want the key in the URL

Another approach is:

Share

Room ID

↓

7Fk29LpQ

Password

↓

blue-elephant-river

The browser derives the encryption key from the password using a strong key derivation function (such as Argon2 or PBKDF2).

Then you share:

Room ID

Password

instead of putting the key in the URL.

Complete flow
John creates room
        │
        ▼
Browser generates:
Room ID = 7Fk29LpQ
Room Key = Random 256-bit
        │
        ▼
Create link:
https://chat.example.com/room/7Fk29LpQ#KEY
        │
        ▼
John shares link
        │
        ├──────── Alice
        ├──────── Bob
        ├──────── Charlie
        └──────── ...100 users
                 │
                 ▼
All browsers know KEY
                 │
                 ▼
Encrypt message locally
                 │
                 ▼
Server receives ciphertext only
                 │
                 ▼
Broadcast ciphertext
                 │
                 ▼
All browsers decrypt using KEY
What should your server store?

For a 24-hour temporary chat, something like this is enough:

Rooms table
Field	Stored?
Room ID	✅ Yes
Created At	✅ Yes
Expires At	✅ Yes
Creator ID (optional)	✅ Yes
Encryption Key	❌ Never
Plaintext Messages	❌ Never
While users are connected (in memory)
Field	Stored?
Socket ID	✅ Yes
Room ID	✅ Yes
Display Name	✅ Yes
Encryption Key	❌ Never

The only machines that should ever know the encryption key are the participants' browsers. Your server acts purely as a relay for encrypted data. This keeps the design simple while providing end-to-end encryption for your temporary collaboration rooms.

Or an even better design (used by Signal, WhatsApp, Matrix)

The invite link contains only the room ID:

https://chat.example.com/room/abc123

When Alice joins:

Alice generates a temporary public/private key pair.
Alice sends only her public key to the server.
The server forwards it to John.
John's browser encrypts the room key with Alice's public key.
The server relays the encrypted room key.
Alice decrypts it locally.

The flow looks like this:

John
 │
 │ Room Key = K
 │
 ▼
Server
 │
 │ Alice joins
 ▼
Alice sends Public Key
 │
 ▼
Server forwards Public Key
 │
 ▼
John encrypts K with Alice's Public Key
 │
 ▼
Encrypted K
 │
 ▼
Server relays
 │
 ▼
Alice decrypts
 │
 ▼
Now Alice knows K

In this design:

✅ The URL contains no secret.
✅ The server never learns the room key.
✅ Only invited participants receive the key.
For your app (24-hour temporary collaboration)

I'd recommend not putting the room key in the URL unless you want maximum simplicity.

A more professional architecture is:

URL: https://chat.example.com/room/abc123
Server stores: room ID, expiry, connected sockets.
Creator's browser: generates the room key.
New users: receive the room key encrypted with their temporary public key.





Sprint 4
Theme

Ephemeral Collaboration

This becomes your headline feature.

Imagine your README.

Instead of

Features

- Login
- Chat
- Read Receipt
- Delete

You write

Ephemeral Collaboration

Create temporary collaboration rooms where messages automatically expire after a configured duration, enabling privacy-focused discussions and interview sessions.

Immediately memorable.

Why is this a good final-year feature?

Because it teaches:

TTL
Background cleanup
Scheduling
Expiration logic
Product design
System design
Database indexing
Security
Socket updates

One feature.

Many concepts.

Sprint 4 Plan
Phase 4.1

Design Ephemeral.

No code.

Questions:

Private chat?
Separate room?
Timer?
Expiration?
Delete immediately?
Countdown?
Phase 4.2

Database design.

Phase 4.3

Backend APIs.

Phase 4.4

Frontend.

Phase 4.5

Real-time deletion.

See?

One complete sprint.

After that...

I wouldn't build more features.

I'd move to something much more valuable.

Sprint 5
Engineering

This is where you impress interviewers.

Examples:

Swagger/OpenAPI
Architecture diagrams
Sequence diagrams
API documentation
Better README
Demo video
Performance metrics
Load testing (you already wanted this)
Logging
Final Project Roadmap
Sprint 3 ✅
Refactor
Typing
Landing
Polish

↓

Sprint 4 ⭐⭐⭐⭐⭐

Ephemeral Collaboration

↓

Sprint 5 ⭐⭐⭐⭐⭐

Engineering Excellence

↓

Sprint 6

Placement Ready
What about Group Chat?

Not now.

Why?

Because group chat doesn't differentiate you.

Everyone builds it.

You can always say in interviews:

"The architecture already supports extending conversations to group participants, but I prioritized implementing Ephemeral Collaboration because it introduced new backend and system-design challenges."

That's actually a stronger engineering answer.

If I were your Tech Lead

This is exactly what I'd tell you in stand-up tomorrow:

No more generic chat features. Build the feature that gives DevClustra its identity.

📌 New Sprint (Locked)
Sprint 4 — Ephemeral Collaboration

We'll treat it exactly like Auth and Messaging:

Phase 4.1: Product design & lifecycle
Phase 4.2: Database design
Phase 4.3: Backend implementation
Phase 4.4: Frontend integration
Phase 4.5: Real-time behavior & cleanup

One phase at a time.

One review at a time.

And when this is finished, DevClustra stops being "a chat application" and becomes "the developer collaboration platform with ephemeral collaboration rooms built to explore backend architecture and real-time systems."

That is a much stronger story to tell in your final-year presentation, on your resume, and in interviews.










# Designing of Ephemeral collob
Example:

devclustra.aalokkumar.dev/session
↓
Create Session
  Join Session
About Temporary Collaboration
Features
↓
devclustra.aalokkumar.dev/session/X7KP9A

//

