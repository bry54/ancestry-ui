# Application Page Content and Feature Ideas

Here is a breakdown of the potential content and features for each page in the application menu.

---

### **Dashboard (`/`)**
This is the user's landing page. It should provide a personalized, at-a-glance summary and encourage engagement.

*   **Core Purpose:** Give the user a quick, relevant overview of their family network and recent activity.
*   **Key Components & Features:**
    *   **Welcome Widget:** A simple "Good morning, [User's Name]" message.
    *   **"On This Day" Widget:** Show family events that happened on the current day in history (births, marriages).
    *   **Upcoming Events:** A list of upcoming birthdays and anniversaries for the next 7-30 days.
    *   **Recent Activity Feed:** A timeline of recent additions to the network (e.g., "Your cousin added Jane Doe to the family tree").
    *   **Invitation Status:** A small card showing pending sent/received invitations.
    *   **Mini-Tree View:** A small, non-interactive snapshot of the user's immediate family.

---

### **User Section**

#### **Profiles (`/user/profiles`)**
This page is for managing the people in the user's network.

*   **Core Purpose:** Allow users to view, create, and edit profiles for family members (including themselves, minors, and deceased individuals).
*   **Key Components & Features:**
    *   **Searchable/Filterable List:** A grid or list of all profiles the user has access to. Can be filtered by family branch, status (living/deceased), etc.
    *   **"Add New Profile" Button:** A primary call-to-action that opens a form to create a new person.
    *   **Profile Cards:** Each card in the list should show a photo, full name, birth/death dates, and immediate relationship to the user.
    *   **Detailed Profile View (when a card is clicked):**
        *   **Bio Tab:** Key facts, biography, timeline of life events.
        *   **Relationships Tab:** Lists all direct relationships (parents, spouse, children) and allows for adding/editing them.
        *   **Media Gallery Tab:** Photos, videos, and stories associated with that person.
        *   **Documents Tab:** Scanned birth certificates, marriage licenses, etc.

#### **My Network (`/user/relations`)**
This page handles the social and connection management aspects.

*   **Core Purpose:** Manage invitations and view established connections.
*   **Key Components & Features:**
    *   **Two Main Tabs:** "Invitations" and "My Connections".
    *   **Invitations Tab:**
        *   **Received:** A list of pending invitations from other users with "Accept" / "Decline" actions.
        *   **Sent:** A list of invitations you've sent, with the ability to "Resend" or "Revoke".
        *   **"Invite Someone" Form:** A simple form to send a new invitation via email.
    *   **My Connections Tab:** A list of all users you are directly connected with in the system.

---

### **Family & Network Section (D3.js Visualizations)**

#### **Tree Explorer (`/network/tree-explorer`)**
*   **Core Purpose:** Provide a classic, hierarchical view of the family tree.
*   **Key Components & Features:**
    *   A D3.js-powered **pedigree chart** (ancestors) or **descendant chart**.
    *   Controls for pan, zoom, and orientation (vertical/horizontal).
    *   Clicking on a person (node) could highlight their direct line or open a summary pop-up.

#### **Relationship Graph (`/network/relations-graph`)**
*   **Core Purpose:** Showcase the power of Neo4j by visualizing the entire web of relationships, not just the direct hierarchy.
*   **Key Components & Features:**
    *   A D3.js **force-directed graph**. Nodes are people, and links (edges) represent relationships.
    *   **Filters:** Allow users to toggle different relationship types on/off (e.g., show/hide "Spouse", "Godparent", "Adopted Child").
    *   **Highlighting:** Clicking a node highlights that person and all their direct connections.
    *   This is perfect for showing complex scenarios like second marriages, adoptions, and other non-traditional family structures that are hard to represent in a simple tree.

#### **Name Distribution (`/network/name-distribution`)**
*   **Core Purpose:** Provide a fun, statistical visualization of names in the family.
*   **Key Components & Features:**
    *   A D3.js **bar chart** showing the most common first names and last names.
    *   A **word cloud** for a more visual representation of name frequency.
    *   Filters for time period or family branch.

#### **Family Size (`/network/family-size`)**
*   **Core Purpose:** Visualize how different branches of the family have grown over time.
*   **Key Components & Features:**
    *   A D3.js **line chart** where the X-axis is time (decades or generations) and the Y-axis is the number of descendants from a specific ancestor.
    *   Users could select different ancestors to compare the growth of their lines.

---

### **Admin Section**

#### **User Management (`/admin/user-management`)**
*   **Core Purpose:** Standard admin interface for managing all users in the system.
*   **Key Components & Features:**
    *   A data table with all registered users.
    *   Actions to: change user roles (e.g., `MEMBER`, `ADMIN`), suspend accounts, view user activity, and trigger password resets.

#### **Government Approvals (`/admin/government-approvals`)**
*   **Core Purpose:** A workflow for your unique data verification feature.
*   **Key Components & Features:**
    *   A queue of pending requests. Each request would show the data being submitted for approval (e.g., a new birth record) and any uploaded evidence.
    *   "Approve" and "Reject" buttons. Approving it could add a "Verified" badge to the data in the main app. Rejecting it would notify the user with a reason.

#### **Audit Logs (`/admin/audit-logs`)**
*   **Core Purpose:** A security and tracking tool for administrators.
*   **Key Components & Features:**
    *   A searchable and filterable log of important events that have occurred in the application (e.g., "User X deleted profile Y", "Admin Z changed user role for A", "User B logged in from new IP").
