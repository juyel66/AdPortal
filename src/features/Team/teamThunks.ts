import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/axios";
import type {
  TeamMember,
  Team,
  InviteTeamMemberPayload,
} from "../../types/team";


const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
});


export const fetchTeamMembers = createAsyncThunk<
  TeamMember[],
  { org_id: string },
  { rejectValue: any }
>("team/fetch-members", async ({ org_id }, { rejectWithValue }) => {
  try {
    const res = await api.get(
      `/api/v1/main/team-members/?org_id=${org_id}`,
      authHeader()
    );
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
      `/api/v1/main/invite-team-member/?org_id=${org_id}`,
      payload,
      authHeader()
    );
    return res.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data || { error: "Failed to invite team member" }
    );
  }
});


export const fetchTeam = createAsyncThunk<
  Team,
  { org_id: string },
  { rejectValue: any }
>("team/fetch-team", async ({ org_id }, { rejectWithValue }) => {
  try {
    const res = await api.get(
      `/api/v1/main/team/?org_id=${org_id}`,
      authHeader()
    );
    return res.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data || { error: "Failed to fetch team" }
    );
  }
});



export const deleteTeamMember = createAsyncThunk<
  number,
  { org_id: string; member_id: number },
  { rejectValue: any }
>("team/delete-member", async ({ org_id, member_id }, { rejectWithValue }) => {
  try {
    await api.delete(
      `/api/v1/main/team-member/${member_id}/?org_id=${org_id}`,
      authHeader()
    );
    return member_id;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data || { error: "Failed to delete team member" }
    );
  }
});
