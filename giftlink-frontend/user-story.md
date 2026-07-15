# User Stories - GiftLink

## Template

**Title:**
_As a [type of user], I want [an action] so that [a benefit/a value]._

**Acceptance Criteria:**
1. [Criterion 1]
2. [Criterion 2]
3. [Criterion 3]

**Priority:** [High/Medium/Low]

**Story Points:** [Estimate]

**Notes:**
[Additional notes or considerations]

---

## User Story 1: Browse Gift Listings

**Title:** View available gifts on the home page

_As a visitor, I want to view a list of available gift items so that I can see what is being shared in my community._

**Acceptance Criteria:**
1. The home page displays all currently listed gifts.
2. Each listing shows the item name, condition, and date added.
3. A "View Details" button navigates to the full item details.

**Priority:** High

**Story Points:** 3

**Notes:** No login required to browse listings.

---

## User Story 2: Register an Account

**Title:** Create a new account

_As a new user, I want to register an account so that I can list items and interact with other users._

**Acceptance Criteria:**
1. A registration form collects first name, last name, email, and password.
2. Passwords are securely hashed before being stored.
3. On successful registration, the user is automatically logged in.

**Priority:** High

**Story Points:** 3

**Notes:** Email must be unique across all accounts.

---

## User Story 3: Log In

**Title:** Log in to an existing account

_As a registered user, I want to log in with my email and password so that I can access my account and list items._

**Acceptance Criteria:**
1. A login form accepts email and password.
2. Invalid credentials show a clear error message.
3. On success, a JWT token is issued and the user session begins.

**Priority:** High

**Story Points:** 2

---

## User Story 4: Search and Filter Gifts

**Title:** Search for specific items

_As a user, I want to search and filter gift listings by category, condition, and age so that I can quickly find items I'm interested in._

**Acceptance Criteria:**
1. Users can filter by category and condition.
2. Users can filter by how recently the item was listed.
3. Users can search by keyword in the item name or description.

**Priority:** Medium

**Story Points:** 5

---

## User Story 5: View Gift Details and Comments

**Title:** View full details of a gift and read comments

_As a user, I want to view full details of a gift listing, including comments from others, so that I can decide whether to request the item._

**Acceptance Criteria:**
1. The details page shows the image, category, condition, and description.
2. All comments on the listing are displayed with the commenter's email and date.
3. Logged-in users can add a new comment.

**Priority:** Medium

**Story Points:** 3

---

## User Story 6: Share a Gift

**Title:** Create a new gift listing

_As a logged-in user, I want to list an item I no longer need so that someone else in the community can benefit from it._

**Acceptance Criteria:**
1. A form collects item name, category, condition, description, and image URL.
2. The new listing appears immediately in the gift list.
3. Only the logged-in user is recorded as the owner of the listing.

**Priority:** High

**Story Points:** 3

---

## User Story 7: Manage My Listings

**Title:** Edit or delete my own gift listings

_As a user, I want to edit or delete the items I've listed so that I can keep my listings accurate and up to date._

**Acceptance Criteria:**
1. Users can only edit or delete listings they own.
2. Deleting a listing removes it from the main gift list immediately.
3. Attempting to edit/delete another user's listing returns an error.

**Priority:** Medium

**Story Points:** 3

---

## User Story 8: Edit My Profile

**Title:** Update my account information

_As a registered user, I want to update my profile details so that my account information stays current._

**Acceptance Criteria:**
1. Users can update first name, last name, email, and password.
2. Changes are saved and reflected immediately after submission.
3. Password updates are hashed before storage.

**Priority:** Low

**Story Points:** 2