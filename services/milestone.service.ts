import { HTTP_STATUS } from "../constant/http.constant";
import {
  createMilestone,
  getMilestones,
} from "../repository/milestone.repository";
import type {
  CreateMilestoneInput,
  MilestoneModel,
  ServiceResult,
} from "../type";

export async function createMilestoneService(
  input: CreateMilestoneInput,
): Promise<ServiceResult<{ message: string; milestone: MilestoneModel }>> {
  if (!input.siteId || !input.title?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "siteId and title are required",
    };
  }

  const milestone = await createMilestone({
    ...input,
    title: input.title.trim(),
  });

  return {
    ok: true,
    status: HTTP_STATUS.CREATED,
    data: {
      message: "Milestone created successfully",
      milestone,
    },
  };
}

export async function getMilestonesService(): Promise<
  ServiceResult<{ milestones: MilestoneModel[] }>
> {
  const milestones = await getMilestones();

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: { milestones },
  };
}
