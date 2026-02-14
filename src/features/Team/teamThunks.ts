import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/axios";
import type {
  TeamMember,
  Team,
  InviteTeamMemberPayload,
} from "../../types/team";

// Fetch team members
export const fetchTeamMembers = createAsyncThunk<
  TeamMember[],
  { org_id: string },
  { rejectValue: any }
>("team/fetch-members", async ({ org_id }, { rejectWithValue }) => {
  try {
    const res = await api.get(`/main/team-members/?org_id=${org_id}`);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data || { error: "Failed to fetch team members" }
    );
  }
});

// Invite team member
export const inviteTeamMember = createAsyncThunk<
  any,
  { org_id: string; payload: InviteTeamMemberPayload },
  { rejectValue: any }
>("team/invite-member", async ({ org_id, payload }, { rejectWithValue }) => {
  try {
    const res = await api.post(
      `/main/invite-team-member/?org_id=${org_id}`,
      payload
    );
    return res.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data || { error: "Failed to invite team member" }
    );
  }
});

// Update team member role - USING PATCH METHOD
export const updateTeamMemberRole = createAsyncThunk<
  TeamMember,
  { org_id: string; member_id: number; role: string },
  { rejectValue: any }
>("team/update-role", async ({ org_id, member_id, role }, { rejectWithValue }) => {
  try {
    const res = await api.patch(
      `/main/team-member/${member_id}/?org_id=${org_id}`,
      { role }
    );
    return res.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data || { error: "Failed to update role" }
    );
  }
});

// Fetch team info/stats
export const fetchTeam = createAsyncThunk<
  Team,
  { org_id: string },
  { rejectValue: any }
>("team/fetch-team", async ({ org_id }, { rejectWithValue }) => {
  try {
    const res = await api.get(`/main/team/?org_id=${org_id}`);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data || { error: "Failed to fetch team" }
    );
  }
});

// Delete team member
export const deleteTeamMember = createAsyncThunk<
  number,
  { org_id: string; member_id: number },
  { rejectValue: any }
>("team/delete-member", async ({ org_id, member_id }, { rejectWithValue }) => {
  try {
    await api.delete(`/main/team-member/${member_id}/?org_id=${org_id}`);
    return member_id; // Return the ID of deleted member for state update
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data || { error: "Failed to delete team member" }
    );
  }
});