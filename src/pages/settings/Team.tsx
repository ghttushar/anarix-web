import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { UserPlus, Send } from "lucide-react";
import { toast } from "sonner";
import { AppTaskbar } from "@/components/layout/AppTaskbar";

const mockUsers = [
  { id: "u1", name: "John Smith", email: "john@company.com", role: "Admin", status: "active", lastLogin: "2025-12-02 09:15" },
  { id: "u2", name: "Sarah Johnson", email: "sarah@company.com", role: "Analyst", status: "active", lastLogin: "2025-12-01 16:42" },
  { id: "u3", name: "Mike Chen", email: "mike@company.com", role: "Viewer", status: "active", lastLogin: "2025-11-28 11:30" },
  { id: "u4", name: "Emily Davis", email: "emily@company.com", role: "Analyst", status: "inactive", lastLogin: "2025-10-15 08:00" },
];

const mockInvites = [
  { id: "inv1", email: "alex@partner.com", role: "Analyst", status: "pending", sentAt: "2025-12-01 10:00" },
  { id: "inv2", email: "lisa@agency.com", role: "Viewer", status: "accepted", sentAt: "2025-11-28 14:30" },
  { id: "inv3", email: "tom@brand.com", role: "Analyst", status: "expired", sentAt: "2025-11-01 09:00" },
];

const userStatusColors: Record<string, string> = { active: "bg-success/10 text-success", inactive: "bg-muted text-muted-foreground" };
const roleColors: Record<string, string> = { Admin: "bg-primary/10 text-primary", Analyst: "bg-accent/20 text-accent-foreground", Viewer: "bg-muted text-muted-foreground" };
const inviteStatusColors: Record<string, string> = { pending: "bg-warning/10 text-warning", accepted: "bg-success/10 text-success", expired: "bg-muted text-muted-foreground" };


const breadcrumbItems = [
  { label: "Settings", href: "/settings/team" },
  { label: "Team" },
];
export default function Team() {
  const [showAddUser, setShowAddUser] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("Viewer");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Viewer");

  const handleAddUser = () => {
    if (!newName || !newEmail) return;
    toast.success(`User ${newName} added successfully`);
    setShowAddUser(false);
    setNewName("");
    setNewEmail("");
    setNewRole("Viewer");
  };

  const handleSendInvite = () => {
    if (!inviteEmail) { toast.error("Please enter an email address"); return; }
    toast.success(`Invitation sent to ${inviteEmail}`);
    setInviteEmail("");
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <AppTaskbar breadcrumbItems={breadcrumbItems} />
        <PageHeader title="Team" subtitle="Manage members and invitations" />

        <Tabs defaultValue="members">
          <TabsList>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="invitations">Invitations</TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setShowAddUser(true)}><UserPlus className="h-4 w-4 mr-2" />Invite User</Button>
            </div>
            <div className="rounded-lg border border-border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUsers.map(u => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell className="text-muted-foreground">{u.email}</TableCell>
                      <TableCell><Badge className={roleColors[u.role]}>{u.role}</Badge></TableCell>
                      <TableCell><Badge className={userStatusColors[u.status]}>{u.status}</Badge></TableCell>
                      <TableCell className="text-muted-foreground">{u.lastLogin}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="invitations" className="space-y-4">
            <div className="rounded-lg border border-border bg-card p-4 space-y-4">
              <h2 className="font-heading text-lg font-medium text-foreground">Send Invitation</h2>
              <div className="flex gap-3">
                <Input placeholder="Email address" type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} className="flex-1" />
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Analyst">Analyst</SelectItem>
                    <SelectItem value="Viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleSendInvite}><Send className="h-4 w-4 mr-2" />Send</Button>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockInvites.map(inv => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-medium">{inv.email}</TableCell>
                      <TableCell className="text-muted-foreground">{inv.role}</TableCell>
                      <TableCell><Badge className={inviteStatusColors[inv.status]}>{inv.status}</Badge></TableCell>
                      <TableCell className="text-muted-foreground">{inv.sentAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add New User</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label>Name</Label><Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Full name" /></div>
            <div><Label>Email</Label><Input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="Email address" type="email" /></div>
            <div>
              <Label>Role</Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Analyst">Analyst</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddUser(false)}>Cancel</Button>
            <Button onClick={handleAddUser}>Add User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
</AppLayout>
  );
}
