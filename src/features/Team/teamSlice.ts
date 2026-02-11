// teamSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TeamState, TeamMember } from "../../types/team";
import {
  fetchTeamMembers,
  inviteTeamMember,
  fetchTeam,
  deleteTeamMember,
} from "./teamThunks";

const initialState: TeamState = {
  members: [],
  team: null,
  loading: false,
  error: null,
  message: null,
};

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    clearTeamError(state) {
      state.error = null;
    },
    clearTeamMessage(state) {
      state.message = null;
    },
    // For immediate UI updates (optimistic updates)
    removeMemberLocally(state, action: PayloadAction<number>) {
      state.members = state.members.filter(m => m.id !== action.payload);
    },
    addMemberLocally(state, action: PayloadAction<TeamMember>) {
      state.members.push(action.payload);
    },
    updateTeamMemberRole(state, action: PayloadAction<{ id: number; role: string }>) {
      const member = state.members.find(m => m.id === action.payload.id);
      if (member) {
        member.role = action.payload.role;
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch Members
    builder
      .addCase(fetchTeamMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTeamMembers.fulfilled,
        (state, action: PayloadAction<TeamMember[]>) => {
          state.loading = false;
          state.members = action.payload;
        }
      )
      .addCase(fetchTeamMembers.rejected, (state, action: any) => {
        state.loading = false;
        state.error =
          action.payload?.error || "Unable to load team members";
      });

    // Invite Member
    builder
      .addCase(inviteTeamMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(inviteTeamMember.fulfilled, (state, action: any) => {
        state.loading = false;
        state.message = action.payload?.message || "Invitation sent successfully!";
      })
      .addCase(inviteTeamMember.rejected, (state, action: any) => {
        state.loading = false;
        state.error =
          action.payload?.error || "Failed to invite team member";
      });

    // Fetch Team
    builder
      .addCase(fetchTeam.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchTeam.fulfilled,
        (state, action: PayloadAction<Team>) => {
          state.loading = false;
          state.team = action.payload;
        }
      )
      .addCase(fetchTeam.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to load team";
      });

    // Delete Member
    builder
      .addCase(deleteTeamMember.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        deleteTeamMember.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.members = state.members.filter(
            (m) => m.id !== action.payload
          );
          state.message = "Team member removed successfully!";
        }
      )
      .addCase(deleteTeamMember.rejected, (state, action: any) => {
        state.loading = false;
        state.error =
          action.payload?.error || "Failed to remove team member";
      });
  },
});

export const { 
  clearTeamError, 
  clearTeamMessage,
  removeMemberLocally,
  addMemberLocally,
  updateTeamMemberRole 
} = teamSlice.actions;
export default teamSlice.reducer;