import { useAppDispatch, useAppSelector } from "../../../src/hooks/reduxHooks";
import {
  fetchTeamMembers,
  inviteTeamMember,
  fetchTeam,
  deleteTeamMember,
} from "../../features/Team/teamThunks";

export const useTeam = () => {
  const dispatch = useAppDispatch();
  const teamState = useAppSelector((state) => state.team);

  return {
    ...teamState,
    fetchMembers: (org_id: string) =>
      dispatch(fetchTeamMembers({ org_id })),
    fetchTeam: (org_id: string) =>
      dispatch(fetchTeam({ org_id })),
    inviteMember: (org_id: string, payload: any) =>
      dispatch(inviteTeamMember({ org_id, payload })),
    removeMember: (org_id: string, member_id: number) =>
      dispatch(deleteTeamMember({ org_id, member_id })),
  };
};
