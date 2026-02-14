import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TeamState, TeamMember, Team } from "../../types/team";
import {
  fetchTeamMembers,
  inviteTeamMember,
  fetchTeam,
  deleteTeamMember,
  updateTeamMemberRole,
} from "./teamThunks";

const initialState: TeamState = {
  members: [],
  team: null,
  loading: false,
  error: null,
  message: null,
  updateLoading: false,
  deleteLoading: false,
  inviteLoading: false,
};

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    // Clear error message
    clearTeamError(state) {
      state.error = null;
    },
    
    // Clear success message
    clearTeamMessage(state) {
      state.message = null;
    },
    
    // For immediate UI updates (optimistic updates)
    removeMemberLocally(state, action: PayloadAction<number>) {
      state.members = state.members.filter(m => m.id !== action.payload);
    },
    
    // Add member locally (for optimistic updates)
    addMemberLocally(state, action: PayloadAction<TeamMember>) {
      // Check if member already exists
      const exists = state.members.some(m => m.id === action.payload.id);
      if (!exists) {
        state.members.push(action.payload);
      }
    },
    
    // Update team member role locally (optimistic update)
    updateTeamMemberRoleLocally(state, action: PayloadAction<{ id: number; role: string }>) {
      const member = state.members.find(m => m.id === action.payload.id);
      if (member) {
        member.role = action.payload.role as any;
      }
    },
    
    // Update member status locally
    updateMemberStatusLocally(state, action: PayloadAction<{ id: number; status: string }>) {
      const member = state.members.find(m => m.id === action.payload.id);
      if (member) {
        member.status = action.payload.status as any;
      }
    },
    
    // Reset team state
    resetTeamState(state) {
      state.members = [];
      state.team = null;
      state.loading = false;
      state.error = null;
      state.message = null;
      state.updateLoading = false;
      state.deleteLoading = false;
      state.inviteLoading = false;
    },
    
    // Set specific loading states
    setUpdateLoading(state, action: PayloadAction<boolean>) {
      state.updateLoading = action.payload;
    },
    
    setDeleteLoading(state, action: PayloadAction<boolean>) {
      state.deleteLoading = action.payload;
    },
    
    setInviteLoading(state, action: PayloadAction<boolean>) {
      state.inviteLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // ========== FETCH TEAM MEMBERS ==========
    builder
      .addCase(fetchTeamMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
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
          action.payload?.error || 
          action.payload?.detail || 
          "Unable to load team members";
      });

    // ========== FETCH TEAM STATS ==========
    builder
      .addCase(fetchTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
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
        state.error = 
          action.payload?.error || 
          action.payload?.detail || 
          "Failed to load team";
      });

    // ========== INVITE TEAM MEMBER ==========
    builder
      .addCase(inviteTeamMember.pending, (state) => {
        state.inviteLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(inviteTeamMember.fulfilled, (state, action: any) => {
        state.inviteLoading = false;
        state.message = action.payload?.message || "Invitation sent successfully!";
        
        // If the API returns the invited member, add it to the list
        if (action.payload?.member) {
          const exists = state.members.some(m => m.id === action.payload.member.id);
          if (!exists) {
            state.members.push(action.payload.member);
          }
        }
      })
      .addCase(inviteTeamMember.rejected, (state, action: any) => {
        state.inviteLoading = false;
        state.error =
          action.payload?.error || 
          action.payload?.detail || 
          "Failed to invite team member";
      });

    // ========== UPDATE TEAM MEMBER ROLE ==========
    builder
      .addCase(updateTeamMemberRole.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(
        updateTeamMemberRole.fulfilled,
        (state, action: PayloadAction<TeamMember>) => {
          state.updateLoading = false;
          state.message = "Team member role updated successfully!";
          
          // Update the member in the list with the response data
          const index = state.members.findIndex(m => m.id === action.payload.id);
          if (index !== -1) {
            state.members[index] = action.payload;
          }
        }
      )
      .addCase(updateTeamMemberRole.rejected, (state, action: any) => {
        state.updateLoading = false;
        state.error =
          action.payload?.error || 
          action.payload?.detail || 
          "Failed to update team member role";
      });

    // ========== DELETE TEAM MEMBER ==========
    builder
      .addCase(deleteTeamMember.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(
        deleteTeamMember.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.deleteLoading = false;
          state.message = "Team member removed successfully!";
          
          // Remove the member from the list
          state.members = state.members.filter(m => m.id !== action.payload);
          
          // Update team stats if available
          if (state.team) {
            state.team.total_members = Math.max(0, state.team.total_members - 1);
            // You might need to adjust other stats based on member status
          }
        }
      )
      .addCase(deleteTeamMember.rejected, (state, action: any) => {
        state.deleteLoading = false;
        state.error =
          action.payload?.error || 
          action.payload?.detail || 
          "Failed to remove team member";
      });
  },
});

// Export all actions
export const { 
  clearTeamError, 
  clearTeamMessage,
  removeMemberLocally,
  addMemberLocally,
  updateTeamMemberRoleLocally,
  updateMemberStatusLocally,
  resetTeamState,
  setUpdateLoading,
  setDeleteLoading,
  setInviteLoading,
} = teamSlice.actions;

// Export selectors for easy access
export const selectTeamMembers = (state: { team: TeamState }) => state.team.members;
export const selectTeamStats = (state: { team: TeamState }) => state.team.team;
export const selectTeamLoading = (state: { team: TeamState }) => state.team.loading;
export const selectTeamError = (state: { team: TeamState }) => state.team.error;
export const selectTeamMessage = (state: { team: TeamState }) => state.team.message;
export const selectUpdateLoading = (state: { team: TeamState }) => state.team.updateLoading;
export const selectDeleteLoading = (state: { team: TeamState }) => state.team.deleteLoading;
export const selectInviteLoading = (state: { team: TeamState }) => state.team.inviteLoading;

export default teamSlice.reducer;