import { HTTP_STATUS } from "../constant/http.constant";
import { createWork, getWorks } from "../repository/work.repository";
import type { CreateWorkInput, ServiceResult, WorkModel } from "../type";

export async function createWorkService(
  input: CreateWorkInput,
  createdBy: number,
): Promise<ServiceResult<{ message: string; work: WorkModel }>> {
  if (!input.projectId || !input.contractor?.trim()) {
    return {
      ok: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "projectId and contractor are required",
    };
  }

  const work = await createWork(
    {
      ...input,
      contractor: input.contractor.trim(),
    },
    createdBy,
  );

  return {
    ok: true,
    status: HTTP_STATUS.CREATED,
    data: {
      message: "Work created successfully",
      work,
    },
  };
}

export async function getWorksService(): Promise<
  ServiceResult<{ works: WorkModel[] }>
> {
  const works = await getWorks();

  return {
    ok: true,
    status: HTTP_STATUS.OK,
    data: { works },
  };
}
